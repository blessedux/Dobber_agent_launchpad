import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Zap,
  Bot,
  Coins,
  Shield,
  Settings,
  Users,
  Network,
  BarChart3,
  Home,
  LineChart,
  Workflow,
} from 'lucide-react';

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Agents',
    href: '/agents',
    icon: Bot,
  },
  {
    name: 'Tokens',
    href: '/tokens',
    icon: Coins,
  },
  {
    name: 'Device Network',
    href: '/device-network',
    icon: Network,
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Security',
    href: '/security',
    icon: Shield,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface NavigationMenuProps {
  className?: string;
}

export default function NavigationMenu({ className }: NavigationMenuProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col space-y-4", className)}>
      <div className="px-3 py-2">
        <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">DOB Protocol</h2>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/agents">
              <Users className="mr-2 h-4 w-4" />
              Agents
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/device-network">
              <Network className="mr-2 h-4 w-4" />
              Device Network
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/portfolio">
              <BarChart3 className="mr-2 h-4 w-4" />
              Portfolio
            </Link>
          </Button>
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">Analytics</h2>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/performance">
              <LineChart className="mr-2 h-4 w-4" />
              Performance
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/ecosystem">
              <Workflow className="mr-2 h-4 w-4" />
              Ecosystem
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
