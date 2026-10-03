import {
  HeartPulse,
  Brain,
  DollarSign,
  Home,
  HelpCircle,
  ShieldAlert,
  AlertTriangle,
  Lock,
  MessageSquare,
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  // add other icons as needed
} from 'lucide-react';

/**
 * Mapping of icon name strings (as stored in the CMS) to the corresponding Lucide React component.
 * This enables dynamic rendering of icons based on a simple string identifier.
 */
export const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  HeartPulse,
  Brain,
  DollarSign,
  Home,
  HelpCircle,
  ShieldAlert,
  AlertTriangle,
  Lock,
  MessageSquare,
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  // extend with additional icons as needed
};
