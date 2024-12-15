'use client';

import { motion } from 'framer-motion';
import {
  Building2,
  Users,
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
  Briefcase,
  UserPlus,
  Scale,
  Filter,
  BarChart,
  PieChart
} from 'lucide-react';

const structureStats = [
  {
    title: 'Structures actives',
    value: '15',
    icon: Building2,
    trend: '+3 ce mois',
    trendUp: true,
    color: 'blue'
  },
  {
    title: 'Chiffre d\'affaires',
    value: '850K€',
    icon: Euro,
    trend: '+12% ce mois',
    trendUp: true,
    color: 'green'
  },
  {
    title: 'Employés',
    value: '45',
    icon: Users,
    trend: '+5 ce mois',
    trendUp: true,
    color: 'purple'
  },
  {
    title: 'Rentabilité',
    value: '24%',
    icon: TrendingUp,
    trend: '+2% ce mois',
    trendUp: true,
    color: 'pink'
  }
];

const structureAlerts = [
  {
    title: 'Déclarations fiscales',
    description: '2 déclarations à effectuer avant le 31/03',
    icon: AlertCircle,
    type: 'warning'
  },
  {
    title: 'Assemblées générales',
    description: '1 AG extraordinaire à programmer',
    icon: AlertCircle,
    type: 'error'
  }
];

const recentActivity = [
  {
    title: 'Nouvelle structure',
    description: 'SARL Immobilier Plus créée',
    timestamp: 'Il y a 2 jours',
    icon: Building2,
    color: 'green'
  },
  {
    title: 'Modification statuts',
    description: 'SCI Les Oliviers - Mise à jour',
    timestamp: 'Il y a 3 jours',
    icon: FileText,
    color: 'blue'
  },
  {
    title: 'Nouveau collaborateur',
    description: 'Marie Dubois - SCI Bellevue',
    timestamp: 'Il y a 5 jours',
    icon: UserPlus,
    color: 'purple'
  }
];

const quickActions = [
  {
    title: 'Créer une structure',
    description: 'Enregistrer une nouvelle entité',
    icon: Plus,
    color: 'emerald'
  },
  {
    title: 'Ajouter un collaborateur',
    description: 'Gérer les équipes',
    icon: UserPlus,
    color: 'blue'
  },
  {
    title: 'Rapport financier',
    description: 'Générer un bilan',
    icon: BarChart,
    color: 'purple'
  }
];

const structures = [
  {
    name: 'SCI Les Oliviers',
    type: 'SCI',
    revenue: '250K€',
    employees: 12,
    status: 'active',
    color: 'green'
  },
  {
    name: 'SARL Immobilier Plus',
    type: 'SARL',
    revenue: '420K€',
    employees: 18,
    status: 'active',
    color: 'blue'
  },
  {
    name: 'SAS Gestion Locative',
    type: 'SAS',
    revenue: '180K€',
    employees: 8,
    status: 'active',
    color: 'purple'
  }
];

export default function StructuresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une structure..."
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
            Gestion des structures
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gérez vos entités juridiques et leurs performances
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
          {structureStats.map((stat, index) => (
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
                <TrendingUp size={16} className={`mr-1 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`} />
                <span className={stat.trendUp ? 'text-green-500' : 'text-red-500'}>{stat.trend}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Structures List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Structures actives</h2>
          <div className="space-y-4">
            {structures.map((structure, index) => (
              <motion.div
                key={structure.name}
                whileHover={{ scale: 1.01 }}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full bg-${structure.color}-100 dark:bg-${structure.color}-900 flex items-center justify-center mr-4`}>
                      <Building2 className={`text-${structure.color}-500`} size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold dark:text-white">{structure.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{structure.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">CA Annuel</p>
                      <p className="font-semibold dark:text-white">{structure.revenue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Employés</p>
                      <p className="font-semibold dark:text-white">{structure.employees}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      structure.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {structure.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Alerts and Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Alerts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Alertes</h2>
            <div className="space-y-4">
              {structureAlerts.map((alert) => (
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
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Activité récente</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
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
    </div>
  );
}
