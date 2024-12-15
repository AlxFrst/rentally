'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function AddPropertyDialog({ scis, onPropertyAdded }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    address: '',
    type: '',
    surface: '',
    rooms: '',
    floor: '',
    buildYear: '',
    hasElevator: false,
    hasParking: false,
    hasBasement: false,
    heatingType: '',
    sciId: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la propriété');
      }

      const newProperty = await response.json();
      toast({
        title: 'Succès',
        description: 'La propriété a été créée avec succès',
      });
      onPropertyAdded(newProperty);
      setOpen(false);
      setFormData({
        address: '',
        type: '',
        surface: '',
        rooms: '',
        floor: '',
        buildYear: '',
        hasElevator: false,
        hasParking: false,
        hasBasement: false,
        heatingType: '',
        sciId: ''
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un bien
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle propriété</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="sciId">SCI (optionnel)</Label>
              <Select
                name="sciId"
                value={formData.sciId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sciId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une SCI (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  {scis.map((sci) => (
                    <SelectItem key={sci.id} value={sci.id}>
                      {sci.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Type de bien</Label>
              <Select
                name="type"
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type de bien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APARTMENT">Appartement</SelectItem>
                  <SelectItem value="HOUSE">Maison</SelectItem>
                  <SelectItem value="STUDIO">Studio</SelectItem>
                  <SelectItem value="COMMERCIAL">Local commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="surface">Surface (m²)</Label>
              <Input
                id="surface"
                name="surface"
                type="number"
                value={formData.surface}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="rooms">Nombre de pièces</Label>
              <Input
                id="rooms"
                name="rooms"
                type="number"
                value={formData.rooms}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="floor">Étage</Label>
              <Input
                id="floor"
                name="floor"
                type="number"
                value={formData.floor}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="buildYear">Année de construction</Label>
              <Input
                id="buildYear"
                name="buildYear"
                type="number"
                value={formData.buildYear}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="heatingType">Type de chauffage</Label>
              <Select
                name="heatingType"
                value={formData.heatingType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, heatingType: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type de chauffage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ELECTRIC">Électrique</SelectItem>
                  <SelectItem value="GAS">Gaz</SelectItem>
                  <SelectItem value="FUEL">Fioul</SelectItem>
                  <SelectItem value="WOOD">Bois</SelectItem>
                  <SelectItem value="HEAT_PUMP">Pompe à chaleur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasElevator"
                  name="hasElevator"
                  checked={formData.hasElevator}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasElevator: checked }))}
                />
                <Label htmlFor="hasElevator">Ascenseur</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasParking"
                  name="hasParking"
                  checked={formData.hasParking}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasParking: checked }))}
                />
                <Label htmlFor="hasParking">Parking</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasBasement"
                  name="hasBasement"
                  checked={formData.hasBasement}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasBasement: checked }))}
                />
                <Label htmlFor="hasBasement">Cave</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
