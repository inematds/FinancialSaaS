const folders = [
    { icon: '📁', name: 'Tax Documents', count: 12 },
    { icon: '📄', name: 'Monthly Statements', count: 24 },
    { icon: '⚖️', name: 'Legal', count: 5 },
    { icon: '📊', name: 'Reports', count: 8 },
];

const recentFiles = [
    { name: 'Q4 2025 Statement.pdf', date: 'Jan 15, 2026', size: '2.4 MB' },
    { name: 'Annual Tax Summary.pdf', date: 'Jan 10, 2026', size: '1.8 MB' },
    { name: 'Portfolio Report.pdf', date: 'Jan 5, 2026', size: '3.2 MB' },
];

export default function Documents() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-archivo font-black text-4xl leading-none mb-2 text-gradient animate-fade-in-up">
                    Documents
                </h1>
                <p className="text-text-secondary animate-fade-in-up delay-100">
                    Secure vault for your financial documents.
                </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Folder Grid */}
                <div className="col-span-8 card-base clip-top-right opacity-0 animate-fade-in-up delay-200">
                    <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold mb-6">
                        Folders
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {folders.map((folder) => (
                            <button
                                key={folder.name}
                                className="p-6 bg-bg-tertiary border-2 border-border-color clip-ticker flex items-center gap-4 cursor-pointer transition-all hover:bg-bg-primary hover:border-accent-green"
                            >
                                <div className="text-4xl">{folder.icon}</div>
                                <div className="text-left">
                                    <h3 className="font-semibold">{folder.name}</h3>
                                    <p className="text-sm text-text-secondary">{folder.count} files</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Files */}
                <div className="col-span-4 card-base clip-bottom-right opacity-0 animate-fade-in-up delay-300">
                    <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold mb-6">
                        Recent Uploads
                    </div>
                    <div className="space-y-3">
                        {recentFiles.map((file) => (
                            <div
                                key={file.name}
                                className="p-4 bg-bg-tertiary clip-ticker flex justify-between items-center hover:bg-bg-primary transition-colors cursor-pointer"
                            >
                                <div>
                                    <div className="font-semibold text-sm">{file.name}</div>
                                    <div className="text-xs text-text-secondary">{file.date}</div>
                                </div>
                                <div className="text-xs text-text-secondary font-mono">{file.size}</div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-3 bg-accent-blue text-bg-primary font-bold text-sm uppercase clip-button hover:bg-accent-green transition-all">
                        Upload Document
                    </button>
                </div>
            </div>
        </div>
    );
}
