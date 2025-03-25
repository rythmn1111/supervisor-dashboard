// pages/field-workers.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

interface FieldWorker {
  id?: number;
  name: string;
  phone_number: string;
  master_category: string;
}

export default function FieldWorkersPage() {
  const router = useRouter();
  const [fieldWorkers, setFieldWorkers] = useState<FieldWorker[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newWorker, setNewWorker] = useState<FieldWorker>({
    name: '',
    phone_number: '',
    master_category: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch field workers and categories on component mount
  useEffect(() => {
    fetchFieldWorkers();
    fetchCategories();
  }, []);

  // Fetch field workers from Supabase
  const fetchFieldWorkers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('field_workers')
        .select('*');
      
      if (error) throw error;
      
      if (data) setFieldWorkers(data);
    } catch (error) {
      console.error('Error fetching field workers:', error);
      toast.error("Failed to fetch field workers");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name');
      
      if (error) throw error;
      
      if (data) setCategories(data.map(cat => cat.name));
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error("Failed to fetch categories");
    }
  };

  // Validate phone number (10 digits only)
  const isValidPhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Add new field worker
  const handleAddFieldWorker = async () => {
    // Validate input
    if (!newWorker.name || !newWorker.phone_number || !newWorker.master_category) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate phone number
    if (!isValidPhoneNumber(newWorker.phone_number)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('field_workers')
        .insert([newWorker])
        .select(); // Use select to return the inserted data

      if (error) throw error;

      if (data) {
        // Update local state
        setFieldWorkers(prev => [...prev, data[0]]);
        
        // Reset form and close dialog
        setNewWorker({
          name: '',
          phone_number: '',
          master_category: ''
        });
        setIsDialogOpen(false);

        // Show success toast
        toast.success("Field worker added successfully");
      }
    } catch (error) {
      console.error('Error adding field worker:', error);
      toast.error("Failed to add field worker");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete field worker
  const handleDeleteFieldWorker = async (id: number) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('field_workers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      // Remove from local state
      setFieldWorkers(prev => prev.filter(worker => worker.id !== id));

      toast.success("Field worker deleted successfully");
    } catch (error) {
      console.error('Error deleting field worker:', error);
      toast.error("Failed to delete field worker");
    } finally {
      setIsLoading(false);
    }
  };

  // Group field workers by master category
  const groupedWorkers = fieldWorkers.reduce((acc, worker) => {
    if (!acc[worker.master_category]) {
      acc[worker.master_category] = [];
    }
    acc[worker.master_category].push(worker);
    return acc;
  }, {} as Record<string, FieldWorker[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Field Workers</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" /> Add Field Worker
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Field Worker</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input 
                placeholder="Name" 
                value={newWorker.name}
                onChange={(e) => setNewWorker(prev => ({
                  ...prev, 
                  name: e.target.value
                }))}
                disabled={isLoading}
              />
              <Input 
  placeholder="Phone Number (10 digits)" 
  value={newWorker.phone_number}
  onChange={(e) => {
    // Only allow numeric input
    const numericValue = e.target.value.replace(/\D/g, '');
    setNewWorker(prev => ({
      ...prev, 
      phone_number: numericValue.slice(0, 10)
    }));
  }}
  className={`
    ${newWorker.phone_number.length !== 10 && newWorker.phone_number.length > 0 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : ''
    }
  `}
  disabled={isLoading}
  maxLength={10}
/>
              <Select
                value={newWorker.master_category}
                onValueChange={(value) => setNewWorker(prev => ({
                  ...prev, 
                  master_category: value
                }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Master Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleAddFieldWorker}
                disabled={
                  isLoading ||
                  !newWorker.name || 
                  !isValidPhoneNumber(newWorker.phone_number) || 
                  !newWorker.master_category
                }
              >
                {isLoading ? 'Adding...' : 'Add Worker'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {Object.entries(groupedWorkers).map(([category, workers]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{category}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.map((worker) => (
              <div 
                key={worker.id} 
                className="bg-white border rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{worker.name}</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteFieldWorker(worker.id!)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">{worker.phone_number}</p>
                <Badge variant="outline" className="mt-2">
                  {worker.master_category}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}