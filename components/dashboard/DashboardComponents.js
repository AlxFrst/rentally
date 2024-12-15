import {
  ClipboardCheck,
  FileText,
  Calendar,
  ArrowRight,
  Activity,
  Users,
} from 'lucide-react';

export const quickActions = [
  {
    title: 'Créer un état des lieux',
    description: 'Générer un nouveau document d\'état des lieux',
    icon: ClipboardCheck,
    color: 'emerald'
  },
  {
    title: 'Ajouter un document',
    description: 'Téléverser un nouveau document',
    icon: FileText,
    color: 'blue'
  },
  {
    title: 'Planifier une visite',
    description: 'Organiser une visite de bien',
    icon: Calendar,
    color: 'purple'
  }
];

export const upcomingTasks = [
  {
    title: 'État des lieux sortant',
    property: 'Appartement Rue Victor Hugo',
    date: '18 Dec 2024',
    type: 'checkout'
  },
  {
    title: 'Renouvellement bail',
    property: 'Studio Place Bellecour',
    date: '22 Dec 2024',
    type: 'renewal'
  }
];

export const getActivityIcon = (type) => {
  switch (type) {
    case 'NEW_TENANT':
      return { icon: Users, color: 'purple' };
    case 'NEW_DOCUMENT':
      return { icon: FileText, color: 'blue' };
    case 'PAYMENT':
      return { icon: Activity, color: 'green' };
    default:
      return { icon: Activity, color: 'gray' };
  }
};
