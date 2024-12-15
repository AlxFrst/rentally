'use client';

import { motion } from 'framer-motion';
import {
  Building2,
  Home,
  Euro,
  TrendingUp,
  AlertCircle,
  FileText,
  ArrowRight,
  Activity,
  Calendar,
  Search,
  Percent,
  MapPin,
  Users,
  ChevronRight,
  RefreshCcw
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AddPropertyDialog } from '@/components/properties/AddPropertyDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast"

export default function PropertiesPage() {
  const { toast } = useToast()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin');
    },
  });

  const [properties, setProperties] = useState([]);
  const [scis, setScis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [propertiesRes, scisRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/scis')
      ]);

      if (!propertiesRes.ok || !scisRes.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const [propertiesData, scisData] = await Promise.all([
        propertiesRes.json(),
        scisRes.json()
      ]);

      setProperties(propertiesData);
      setScis(scisData);
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message,
      })
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProperties = properties.filter(property =>
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les statistiques
  const stats = [
    {
      title: 'Biens',
      value: properties.length.toString(),
      icon: Building2,
      color: 'text-blue-500',
    },
    {
      title: 'Loués',
      value: properties.filter(p => p.tenants && p.tenants.length > 0).length.toString(),
      icon: Home,
      color: 'text-green-500',
    },
    {
      title: "Taux d'occupation",
      value: properties.length > 0
        ? Math.round((properties.filter(p => p.tenants && p.tenants.length > 0).length / properties.length) * 100) + '%'
        : '0%',
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      title: 'Documents',
      value: '0',
      icon: FileText,
      color: 'text-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <RefreshCcw className="w-8 h-8 text-gray-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-900">Une erreur est survenue</h2>
        <p className="text-gray-600">{error}</p>
        <Button onClick={fetchData} variant="outline" className="mt-4">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes biens immobiliers</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Gérez votre portefeuille immobilier
          </p>
        </div>
        <AddPropertyDialog scis={scis} onPropertyAdded={(newProperty) => setProperties(prev => [...prev, newProperty])} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}/10 to-${stat.color}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-${stat.color}/10 dark:bg-${stat.color}/20`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <h3 className="mt-4 text-zinc-600 dark:text-zinc-400">{stat.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            type="text"
            placeholder="Rechercher une propriété..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Liste des propriétés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Link
            key={property.id}
            href={`/dashboard/properties/${property.id}`}
            className="block group"
          >
            <Card className="transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {property.type === 'HOUSE' ? 'Maison' :
                       property.type === 'APARTMENT' ? 'Appartement' :
                       property.type === 'STUDIO' ? 'Studio' :
                       property.type === 'COMMERCIAL' ? 'Local commercial' : 
                       'Autre'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {property.address}
                    </CardDescription>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Surface</span>
                    <span className="font-medium">{property.surface} m²</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Pièces</span>
                    <span className="font-medium">{property.rooms}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">État</span>
                    {property.tenants && property.tenants.length > 0 ? (
                      <Badge variant="success">Loué</Badge>
                    ) : (
                      <Badge variant="secondary">Disponible</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Documents</span>
                    <span className="font-medium">{property._count?.documents || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Message si aucune propriété */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Home className="w-12 h-12 mx-auto text-zinc-400" />
          <h3 className="mt-4 text-lg font-medium">Aucune propriété trouvée</h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {searchTerm ? 'Aucune propriété ne correspond à votre recherche.' : 'Commencez par ajouter votre première propriété.'}
          </p>
        </div>
      )}
    </div>
  );
}
