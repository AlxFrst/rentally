'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Home,
  Users,
  FileText,
  BarChart,
  Settings,
  ChevronLeft,
  Menu,
  LogOut
} from 'lucide-react';

const menuItems = [
  {
    title: 'Vue d\'ensemble',
    icon: BarChart,
    href: '/dashboard',
    color: 'blue'
  },
  {
    title: 'Structures (SCI)',
    icon: Building2,
    href: '/dashboard/structures',
    color: 'purple'
  },
  {
    title: 'Biens Immobiliers',
    icon: Home,
    href: '/dashboard/properties',
    color: 'green'
  },
  {
    title: 'Locataires',
    icon: Users,
    href: '/dashboard/tenants',
    color: 'pink'
  },
  {
    title: 'Documents',
    icon: FileText,
    href: '/dashboard/documents',
    color: 'yellow'
  },
  {
    title: 'Paramètres',
    icon: Settings,
    href: '/dashboard/settings',
    color: 'zinc'
  }
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? '4rem' : '16rem',
      }}
      className="h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col relative group"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="font-semibold text-lg">EasyRent</span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="block"
            >
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative overflow-hidden ${
                  isActive
                    ? `bg-${item.color}-50 dark:bg-${item.color}-900/20`
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r from-${item.color}-500/10 to-${item.color}-600/10`}
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: 'linear'
                    }}
                  />
                )}
                <div className={`relative z-10 ${isActive ? `text-${item.color}-600 dark:text-${item.color}-400` : ''}`}>
                  <item.icon size={20} />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`relative z-10 ${isActive ? `text-${item.color}-600 dark:text-${item.color}-400` : ''}`}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
        <motion.button
          whileHover={{ x: 5 }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                Déconnexion
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
