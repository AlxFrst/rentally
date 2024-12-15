'use client';

import { motion } from 'framer-motion';
import {
  Users,
  User,
  Euro,
  TrendingUp,
  AlertCircle,
  FileText,
  Plus,
  ArrowRight,
  Activity,
  Calendar,
  Search,
  Bell,
  UserPlus,
  MessageSquare,
  Home,
  RefreshCcw
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { AddTenantDialog } from '@/components/tenants/AddTenantDialog';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TenantsPage() {
  const { toast } = useToast();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin');
    },
  });

  const router = useRouter();

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/tenants');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des locataires');
      }

      const data = await response.json();
      setTenants(data);
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
    fetchData();
  }, []);

  // Calculer les statistiques réelles
  const stats = [
    {
      title: 'Total locataires',
      value: tenants.length.toString(),
      icon: Users,
      trend: '',
      trendUp: true,
      color: 'blue'
    },
    {
      title: 'Taux d\'occupation',
      value: tenants.length > 0
        ? Math.round((tenants.filter(t => t.properties?.some(p => p.active)).length / tenants.length) * 100) + '%'
        : '0%',
      icon: Home,
      trend: '',
      trendUp: true,
      color: 'green'
    },
    {
      title: 'Loyers mensuels',
      value: tenants.reduce((sum, tenant) => {
        const activeProperty = tenant.properties?.find(p => p.active);
        return sum + (activeProperty ? activeProperty.rentAmount || 0 : 0);
      }, 0).toLocaleString('fr-FR') + '€',
      icon: Euro,
      trend: '',
      trendUp: true,
      color: 'purple'
    },
    {
      title: 'Documents',
      value: tenants.reduce((sum, tenant) => sum + (tenant.documents?.length || 0), 0).toString(),
      icon: FileText,
      trend: '',
      trendUp: true,
      color: 'pink'
    }
  ];

  const filteredTenants = tenants;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Locataires</h1>
        <AddTenantDialog onTenantAdded={fetchData} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                  </div>
                  {stat.trend && (
                    <div className={`flex items-center ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                      <span className="text-sm font-medium">{stat.trend}</span>
                      <TrendingUp className="w-4 h-4 ml-1" />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-4">
            {filteredTenants.map((tenant, index) => (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => router.push(`/dashboard/tenants/${tenant.id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {tenant.firstName} {tenant.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{tenant.email}</p>
                    </div>
                    <Badge variant={tenant.properties?.some(p => p.active) ? "success" : "secondary"}>
                      {tenant.properties?.some(p => p.active) ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Home className="w-4 h-4 mr-2" />
                    {tenant.properties?.find(p => p.active)?.property.address || 'Aucun bien'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Euro className="w-4 h-4 mr-2" />
                    {tenant.properties?.find(p => p.active)?.rentAmount?.toLocaleString('fr-FR') || 0}€ /mois
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FileText className="w-4 h-4 mr-2" />
                    {tenant.documents?.length || 0} document{(tenant.documents?.length || 0) !== 1 ? 's' : ''}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
