export default function Analytics() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-archivo font-black text-4xl leading-none mb-2 text-gradient animate-fade-in-up">
                    Analytics
                </h1>
                <p className="text-text-secondary animate-fade-in-up delay-100">
                    Performance metrics and historical analysis.
                </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 card-base clip-top-right opacity-0 animate-fade-in-up delay-200">
                    <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold mb-6">
                        Coming Soon
                    </div>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                        <p className="text-text-secondary max-w-md">
                            Deep portfolio insights, risk metrics, and performance attribution coming in the next update.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
