'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Home, Users, MapPin, Calendar, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AssignTenantsDialog } from '@/components/properties/AssignTenantsDialog';

export default function PropertyPage({ params }) {
  const { propertyId } = params;
  const { toast } = useToast();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin');
    },
  });

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/properties/${propertyId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données de la propriété');
      }

      const data = await response.json();
      setProperty(data);
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [propertyId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">
      {error}
    </div>;
  }

  if (!property) {
    return <div className="flex items-center justify-center min-h-screen">
      Propriété non trouvée
    </div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{property.address}</h1>
        <div className="flex gap-2">
          <Badge variant="outline">{property.type}</Badge>
          <Badge variant={property.status === 'rented' ? 'success' : 'secondary'}>
            {property.status === 'rented' ? 'Loué' : 'Vacant'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations générales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{property.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{property.surface} m² - {property.rooms} pièces</span>
              </div>
              {property.floor && (
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>Étage {property.floor}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Construit en {property.buildYear}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Locataires actuels</CardTitle>
          </CardHeader>
          <CardContent>
            {property.tenants && property.tenants.length > 0 ? (
              <div className="space-y-4">
                {property.tenants.map((tenantRelation) => (
                  <div key={tenantRelation.tenant.id} className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {tenantRelation.tenant.firstName} {tenantRelation.tenant.lastName}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">Aucun locataire</div>
            )}
            <div className="mt-4">
              <AssignTenantsDialog 
                propertyId={propertyId} 
                onAssigned={fetchPropertyData}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4" />
              <span>{property._count?.documents || 0} documents</span>
            </div>
            <Button variant="outline" className="w-full">
              Gérer les documents
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
