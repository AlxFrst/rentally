'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Home,
  FileText,
  Euro,
  Calendar,
  Phone,
  Mail,
  Briefcase,
  Upload
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TenantDetailsPage({ params }) {
  const { tenantId } = params;
  const { toast } = useToast();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin');
    },
  });

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTenantData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/tenants/${tenantId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données du locataire');
      }

      const data = await response.json();
      setTenant(data);
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
    fetchTenantData();
  }, [tenantId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenantId', tenantId);

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload du document');
      }

      toast({
        title: "Succès",
        description: "Le document a été uploadé avec succès",
      });
      fetchTenantData(); // Rafraîchir les données
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

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

  if (!tenant) {
    return <div className="flex items-center justify-center min-h-screen">
      Locataire non trouvé
    </div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {tenant.firstName} {tenant.lastName}
        </h1>
        <div className="flex gap-2">
          <Badge variant={tenant.properties?.some(p => p.active) ? "success" : "secondary"}>
            {tenant.properties?.some(p => p.active) ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{tenant.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{tenant.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Né(e) le {new Date(tenant.birthDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{tenant.profession}</span>
              </div>
              <div className="flex items-center gap-2">
                <Euro className="w-4 h-4" />
                <span>{tenant.salary.toLocaleString('fr-FR')}€ /an</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Biens loués</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenant.properties?.filter(p => p.active).map((propertyRelation) => (
                <div key={propertyRelation.property.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4" />
                    <span className="font-medium">{propertyRelation.property.address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <div>Loyer: {propertyRelation.rentAmount?.toLocaleString('fr-FR')}€</div>
                    <div>Dépôt: {propertyRelation.depositAmount?.toLocaleString('fr-FR')}€</div>
                    <div>Début: {new Date(propertyRelation.startDate).toLocaleDateString()}</div>
                    {propertyRelation.endDate && (
                      <div>Fin: {new Date(propertyRelation.endDate).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              ))}
              {!tenant.properties?.some(p => p.active) && (
                <div className="text-gray-500">Aucun bien actuellement loué</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Documents</span>
              <Button variant="outline" size="sm" className="relative">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
                <Upload className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenant.documents?.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {doc.type}
                        {doc.expiryDate && ` - Expire le ${new Date(doc.expiryDate).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      Voir
                    </a>
                  </Button>
                </div>
              ))}
              {!tenant.documents?.length && (
                <div className="text-gray-500">Aucun document</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
