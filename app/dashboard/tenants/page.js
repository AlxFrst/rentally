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
import { AddTenantDialog } from '@/components/tenants/AddTenantDialog';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function TenantsPage() {
  const { toast } = useToast();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin');
    },
  });

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredTenants = tenants.filter(tenant =>
    `${tenant.firstName} ${tenant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        ? Math.round((tenants.filter(t => t.properties.some(p => p.active)).length / tenants.length) * 100) + '%'
        : '0%',
      icon: Home,
      trend: '',
      trendUp: true,
      color: 'green'
    },
    {
      title: 'Loyers mensuels',
      value: tenants.reduce((sum, tenant) => {
        const activeProperty = tenant.properties.find(p => p.active);
        return sum + (activeProperty ? activeProperty.rentAmount : 0);
      }, 0).toLocaleString('fr-FR') + '€',
      icon: Euro,
      trend: '',
      trendUp: true,
      color: 'purple'
    },
    {
      title: 'Documents',
      value: tenants.reduce((sum, tenant) => sum + tenant.documents.length, 0).toString(),
      icon: FileText,
      trend: '',
      trendUp: true,
      color: 'pink'
    }
  ];

  const quickActions = [
    {
      title: 'Ajouter un locataire',
      description: 'Enregistrer un nouveau locataire',
      icon: UserPlus,
      color: 'emerald',
      action: () => document.getElementById('add-tenant-trigger')?.click()
    },
    {
      title: 'Gérer les documents',
      description: 'Accéder aux baux et quittances',
      icon: FileText,
      color: 'purple',
      action: () => {}
    }
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Rechercher un locataire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <AddTenantDialog
            id="add-tenant-trigger"
            onTenantAdded={(newTenant) => {
              setTenants(prev => [...prev, newTenant]);
              toast({
                title: "Succès",
                description: "Le locataire a été ajouté avec succès",
              });
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Gestion des locataires
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {filteredTenants.length} locataire{filteredTenants.length !== 1 ? 's' : ''} au total
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              whileHover={{ scale: 1.02 }}
              onClick={action.action}
              className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full bg-${action.color}-100 dark:bg-${action.color}-900 flex items-center justify-center mb-4`}>
                <action.icon className={`text-${action.color}-500`} size={24} />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">{action.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{action.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
            >
              <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900 flex items-center justify-center mb-4`}>
                <stat.icon className={`text-${stat.color}-500`} size={24} />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{stat.title}</h3>
              <p className="text-2xl font-bold mb-2 dark:text-white">{stat.value}</p>
              {stat.trend && (
                <div className="flex items-center text-sm">
                  <TrendingUp size={16} className={`mr-1 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={stat.trendUp ? 'text-green-500' : 'text-red-500'}>{stat.trend}</span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Liste des locataires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTenants.map((tenant) => (
              <motion.div
                key={tenant.id}
                whileHover={{ scale: 1.01 }}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white">
                      {tenant.firstName} {tenant.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{tenant.email}</p>
                  </div>
                  <Badge variant={tenant.properties.some(p => p.active) ? "success" : "secondary"}>
                    {tenant.properties.some(p => p.active) ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Home className="w-4 h-4 mr-2" />
                    {tenant.properties.find(p => p.active)?.property.address || 'Aucun bien'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Euro className="w-4 h-4 mr-2" />
                    {tenant.properties.find(p => p.active)?.rentAmount.toLocaleString('fr-FR') || 0}€ /mois
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FileText className="w-4 h-4 mr-2" />
                    {tenant.documents.length} document{tenant.documents.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
