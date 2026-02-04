import PortfolioHeroCard from '../components/dashboard/PortfolioHeroCard';
import AIAdvisorCard from '../components/dashboard/AIAdvisorCard';
import MarketPulseCard from '../components/dashboard/MarketPulseCard';
import AllocationCard from '../components/dashboard/AllocationCard';
import GoalsCard from '../components/dashboard/GoalsCard';
import TransactionsCard from '../components/dashboard/TransactionsCard';
import PerformanceCard from '../components/dashboard/PerformanceCard';
import QuickActionsCard from '../components/dashboard/QuickActionsCard';

export default function Dashboard() {
    return (
        <div className="space-y-12">
            {/* Greeting */}
            <div className="mb-12">
                <h1 className="font-archivo font-black text-5xl leading-none mb-2 text-gradient animate-fade-in-up">
                    Good Evening, Robert.
                </h1>
                <p className="text-text-secondary animate-fade-in-up delay-100">
                    Your financial command center is ready.
                </p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Row 1: Portfolio Hero + AI Advisor */}
                <PortfolioHeroCard />
                <AIAdvisorCard />

                {/* Row 2: Market Pulse + Allocation + Goals */}
                <MarketPulseCard />
                <AllocationCard />
                <GoalsCard />

                {/* Row 3: Transactions + Performance */}
                <TransactionsCard />
                <PerformanceCard />

                {/* Row 4: Quick Actions */}
                <QuickActionsCard />
            </div>
        </div>
    );
}
