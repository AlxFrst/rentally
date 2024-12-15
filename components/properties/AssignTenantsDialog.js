'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AssignTenantsDialog({ propertyId, onAssigned }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const { toast } = useToast();

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/tenants');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des locataires');
      }
      const data = await response.json();
      setTenants(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des locataires",
      });
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchTenants();
  };

  const handleAssign = async () => {
    if (!selectedTenantId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un locataire",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${propertyId}/tenants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId: selectedTenantId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'assignation du locataire');
      }

      toast({
        title: "Succès",
        description: "Le locataire a été assigné avec succès",
      });

      setOpen(false);
      if (onAssigned) {
        onAssigned();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleOpen}>
          <Users className="mr-2 h-4 w-4" />
          Assigner un locataire
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assigner un locataire</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="tenant">Sélectionner un locataire</Label>
            <Select
              value={selectedTenantId}
              onValueChange={setSelectedTenantId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un locataire" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.firstName} {tenant.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAssign} disabled={loading}>
            {loading ? 'Assignation...' : 'Assigner'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
