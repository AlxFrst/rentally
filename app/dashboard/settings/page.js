'use client';

import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  CreditCard,
  Mail,
  Smartphone,
  Eye,
  Key,
  Save,
  AlertCircle
} from 'lucide-react';

const settingsCategories = [
  {
    title: 'Profil',
    icon: User,
    color: 'blue',
    settings: [
      { name: 'Nom', value: 'Alexandre Forestier', type: 'text' },
      { name: 'Email', value: 'alexandre@example.com', type: 'email' },
      { name: 'Téléphone', value: '+33 6 12 34 56 78', type: 'tel' }
    ]
  },
  {
    title: 'Apparence',
    icon: Moon,
    color: 'purple',
    settings: [
      { name: 'Thème', value: 'Sombre', type: 'select', options: ['Clair', 'Sombre', 'Système'] },
      { name: 'Langue', value: 'Français', type: 'select', options: ['Français', 'English'] }
    ]
  },
  {
    title: 'Notifications',
    icon: Bell,
    color: 'yellow',
    settings: [
      { name: 'Notifications email', value: true, type: 'toggle' },
      { name: 'Notifications push', value: true, type: 'toggle' },
      { name: 'Alertes de paiement', value: true, type: 'toggle' }
    ]
  },
  {
    title: 'Sécurité',
    icon: Shield,
    color: 'green',
    settings: [
      { name: 'Authentification 2FA', value: false, type: 'toggle' },
      { name: 'Changer le mot de passe', value: '', type: 'button' },
      { name: 'Sessions actives', value: '', type: 'button' }
    ]
  },
  {
    title: 'Paiement',
    icon: CreditCard,
    color: 'pink',
    settings: [
      { name: 'Mode de paiement', value: 'Visa •••• 4242', type: 'text' },
      { name: 'Facturation', value: 'Mensuelle', type: 'select', options: ['Mensuelle', 'Annuelle'] }
    ]
  }
];

const recentActivity = [
  {
    title: 'Mot de passe modifié',
    description: 'Changement de mot de passe effectué',
    timestamp: 'Il y a 2 jours',
    icon: Key,
    color: 'blue'
  },
  {
    title: 'Email mis à jour',
    description: 'Nouvelle adresse email confirmée',
    timestamp: 'Il y a 5 jours',
    icon: Mail,
    color: 'green'
  },
  {
    title: '2FA activé',
    description: 'Authentification à deux facteurs activée',
    timestamp: 'Il y a 1 semaine',
    icon: Shield,
    color: 'purple'
  }
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Paramètres
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gérez vos préférences et paramètres de compte
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Categories */}
          <div className="lg:col-span-2 space-y-8">
            {settingsCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-full bg-${category.color}-100 dark:bg-${category.color}-900 flex items-center justify-center mr-4`}>
                    <category.icon className={`text-${category.color}-500`} size={24} />
                  </div>
                  <h2 className="text-xl font-semibold dark:text-white">{category.title}</h2>
                </div>

                <div className="space-y-6">
                  {category.settings.map((setting) => (
                    <div key={setting.name} className="flex items-center justify-between">
                      <label className="text-gray-700 dark:text-gray-300">{setting.name}</label>
                      {setting.type === 'toggle' ? (
                        <div className={`w-11 h-6 rounded-full ${setting.value ? 'bg-blue-500' : 'bg-gray-300'} relative cursor-pointer transition-colors`}>
                          <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${setting.value ? 'right-1' : 'left-1'}`} />
                        </div>
                      ) : setting.type === 'select' ? (
                        <select className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
                          {setting.options?.map((option) => (
                            <option key={option} selected={option === setting.value}>{option}</option>
                          ))}
                        </select>
                      ) : setting.type === 'button' ? (
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          {setting.name}
                        </button>
                      ) : (
                        <input
                          type={setting.type}
                          value={setting.value}
                          className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm sticky top-8"
            >
              <h2 className="text-xl font-semibold mb-6 dark:text-white">Activité récente</h2>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.title} className="flex items-start">
                    <div className={`w-10 h-10 rounded-full bg-${activity.color}-100 dark:bg-${activity.color}-900 flex items-center justify-center mr-4`}>
                      <activity.icon className={`text-${activity.color}-500`} size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-white">{activity.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
