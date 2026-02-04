import TopNav from '../components/layout/TopNav';
import { Outlet } from 'react-router-dom';
import FinancialAdvisorChat from '../components/ai/FinancialAdvisorChat';

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-bg-primary text-white font-archivo">
            <TopNav />
            <main className="max-w-[1800px] mx-auto px-8 py-12">
                <Outlet />
            </main>
            <FinancialAdvisorChat />
        </div>
    );
}
