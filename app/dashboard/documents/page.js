'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  File,
  Upload,
  TrendingUp,
  AlertCircle,
  Download,
  Plus,
  ArrowRight,
  Activity,
  Calendar,
  Search,
  Bell,
  FolderOpen,
  Filter,
  Clock
} from 'lucide-react';

const documentStats = [
  {
    title: 'Total documents',
    value: '156',
    icon: FileText,
    trend: '+12 ce mois',
    trendUp: true,
    color: 'blue'
  },
  {
    title: 'Documents récents',
    value: '24',
    icon: Clock,
    trend: 'Cette semaine',
    trendUp: true,
    color: 'green'
  },
  {
    title: 'À renouveler',
    value: '8',
    icon: Calendar,
    trend: 'Dans 30 jours',
    trendUp: false,
    color: 'yellow'
  },
  {
    title: 'Espace utilisé',
    value: '2.4 GB',
    icon: TrendingUp,
    trend: '60% capacité',
    trendUp: true,
    color: 'purple'
  }
];

const documentAlerts = [
  {
    title: 'Documents à renouveler',
    description: '3 diagnostics DPE arrivent à expiration',
    icon: AlertCircle,
    type: 'warning'
  },
  {
    title: 'Documents manquants',
    description: '2 baux locatifs sans état des lieux',
    icon: AlertCircle,
    type: 'error'
  }
];

const recentActivity = [
  {
    title: 'Nouveau document',
    description: 'État des lieux - Apt. rue Victor Hugo',
    timestamp: 'Il y a 2 heures',
    icon: FileText,
    color: 'green'
  },
  {
    title: 'Document mis à jour',
    description: 'Bail modifié - SCI Les Roses',
    timestamp: 'Il y a 5 heures',
    icon: File,
    color: 'blue'
  },
  {
    title: 'Document téléchargé',
    description: 'Quittance de loyer - Mars 2024',
    timestamp: 'Il y a 1 jour',
    icon: Download,
    color: 'purple'
  }
];

const quickActions = [
  {
    title: 'Ajouter un document',
    description: 'Importer un nouveau fichier',
    icon: Upload,
    color: 'emerald'
  },
  {
    title: 'Créer un dossier',
    description: 'Organiser vos documents',
    icon: FolderOpen,
    color: 'blue'
  },
  {
    title: 'Générer un rapport',
    description: 'Créer un récapitulatif',
    icon: FileText,
    color: 'purple'
  }
];

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un document..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Filter size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
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
            Gestion documentaire
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gérez et organisez tous vos documents immobiliers
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              whileHover={{ scale: 1.02 }}
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
          {documentStats.map((stat, index) => (
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
              <div className="flex items-center text-sm">
                <Clock size={16} className="mr-1 text-gray-500" />
                <span className="text-gray-500">{stat.trend}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Alerts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Alertes</h2>
          <div className="space-y-4">
            {documentAlerts.map((alert, index) => (
              <motion.div
                key={alert.title}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-lg border ${
                  alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' : 'border-red-200 bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-center">
                  <alert.icon
                    size={20}
                    className={alert.type === 'warning' ? 'text-yellow-500' : 'text-red-500'}
                  />
                  <div className="ml-3">
                    <h3 className="font-medium dark:text-white">{alert.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{alert.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Activité récente</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.title}
                whileHover={{ scale: 1.01 }}
                className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full bg-${activity.color}-100 dark:bg-${activity.color}-900 flex items-center justify-center`}>
                    <activity.icon className={`text-${activity.color}-500`} size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium dark:text-white">{activity.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.timestamp}</p>
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
