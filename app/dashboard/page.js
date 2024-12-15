'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Building2,
  Home,
  Users,
  FileText,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Activity,
  ClipboardCheck,
  Calendar,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { quickActions, upcomingTasks, getActivityIcon } from '@/components/dashboard/DashboardComponents';

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin');
    },
  });

  const [dashboardData, setDashboardData] = useState({
    stats: {
      sciCount: 0,
      propertyCount: 0,
      tenantCount: 0,
      documentCount: 0
    },
    alerts: [],
    recentActivity: [],
    financialMetrics: {
      monthlyIncome: 0,
      occupancyRate: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const stats = [
    {
      title: 'SCI actives',
      value: dashboardData.stats.sciCount.toString(),
      icon: Building2,
      color: 'blue'
    },
    {
      title: 'Biens immobiliers',
      value: dashboardData.stats.propertyCount.toString(),
      icon: Home,
      color: 'green'
    },
    {
      title: 'Locataires',
      value: dashboardData.stats.tenantCount.toString(),
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Documents',
      value: dashboardData.stats.documentCount.toString(),
      icon: FileText,
      color: 'pink'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-purple-600/50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-4">
            Bienvenue, {session?.user?.name || 'Utilisateur'}
          </h1>
          <p className="text-blue-100 max-w-xl mb-6">
            Voici un aperçu de votre portefeuille immobilier
          </p>
          <div className="flex flex-wrap gap-4">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <action.icon className="w-4 h-4" />
                <span>{action.title}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <h3 className="mt-4 text-zinc-600 dark:text-zinc-400">{stat.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Financial Overview */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Aperçu Financier</h2>
          <select className="bg-zinc-100 dark:bg-zinc-700 border-none rounded-lg px-3 py-1">
            <option>Ce mois</option>
            <option>3 derniers mois</option>
            <option>Cette année</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-700/50"
          >
            <h3 className="text-sm text-zinc-600 dark:text-zinc-400">Revenus mensuels</h3>
            <div className="mt-2">
              <span className="text-2xl font-semibold">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
                  .format(dashboardData.financialMetrics.monthlyIncome)}
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-700/50"
          >
            <h3 className="text-sm text-zinc-600 dark:text-zinc-400">Taux d'occupation</h3>
            <div className="mt-2">
              <span className="text-2xl font-semibold">
                {Math.round(dashboardData.financialMetrics.occupancyRate)}%
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Section */}
        {dashboardData.alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Alertes</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
                Voir tout <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20"
                >
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium">{alert.name}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Expire le {new Date(alert.expiryDate).toLocaleDateString('fr-FR')} - {alert.propertyName}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Tâches à venir</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
              Voir agenda <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {upcomingTasks.map((task, i) => (
              <motion.div
                key={task.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-700/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    {task.type === 'checkout' ? (
                      <ClipboardCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {task.property}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-zinc-500">{task.date}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      {dashboardData.recentActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Activité récente</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
              Voir tout <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity, i) => {
              const { icon: ActivityIcon, color } = getActivityIcon(activity.type);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-700/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <ActivityIcon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
                    </div>
                    <div>
                      <h3 className="font-medium">Nouveau locataire</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {activity.firstName} {activity.lastName} - {activity.propertyName}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
