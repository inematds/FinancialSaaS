"""
Company Intelligence Web Scraper
Scrapes company information from public sources for the FinPilot dashboard.

Usage:
    python company_scraper.py AAPL
    python company_scraper.py --symbol MSFT

Requirements:
    pip install requests beautifulsoup4 lxml

Output:
    Returns JSON with company data including:
    - Company overview
    - Key executives
    - Recent news
    - Financial metrics
"""

import argparse
import json
import sys
from typing import Dict, Any, Optional
import requests
from bs4 import BeautifulSoup
from datetime import datetime

class CompanyScraper:
    """Scrapes company intelligence data from public sources."""
    
    def __init__(self, symbol: str):
        self.symbol = symbol.upper()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        
    def scrape_yahoo_profile(self) -> Dict[str, Any]:
        """Scrape company profile from Yahoo Finance."""
        url = f"https://finance.yahoo.com/quote/{self.symbol}/profile"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'lxml')
            
            # Company name and description
            profile = {
                'symbol': self.symbol,
                'name': '',
                'sector': '',
                'industry': '',
                'website': '',
                'description': '',
                'employees': '',
                'headquarters': '',
                'executives': []
            }
            
            # Try to find company name
            name_elem = soup.select_one('h1.yf-xxbei9')
            if name_elem:
                profile['name'] = name_elem.text.strip()
            
            # Try to find description
            desc_elem = soup.select_one('section[data-testid="description"] p')
            if desc_elem:
                profile['description'] = desc_elem.text.strip()[:500]  # Limit length
            
            # Try to find sector/industry
            sector_elem = soup.select_one('a[data-testid="sector-link"]')
            if sector_elem:
                profile['sector'] = sector_elem.text.strip()
                
            industry_elem = soup.select_one('a[data-testid="industry-link"]')
            if industry_elem:
                profile['industry'] = industry_elem.text.strip()
            
            # Key executives (simplified)
            exec_section = soup.select('table tbody tr')
            for row in exec_section[:5]:  # Top 5 executives
                cells = row.select('td')
                if len(cells) >= 2:
                    profile['executives'].append({
                        'name': cells[0].text.strip(),
                        'title': cells[1].text.strip() if len(cells) > 1 else ''
                    })
            
            return profile
            
        except Exception as e:
            return {
                'symbol': self.symbol,
                'error': str(e),
                'name': self.symbol,
                'description': 'Unable to fetch company profile. Please try again later.',
                'executives': []
            }
    
    def scrape_key_stats(self) -> Dict[str, Any]:
        """Scrape key statistics from Yahoo Finance."""
        url = f"https://finance.yahoo.com/quote/{self.symbol}/key-statistics"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'lxml')
            
            stats = {
                'market_cap': '',
                'pe_ratio': '',
                'eps': '',
                'dividend_yield': '',
                'beta': '',
                '52_week_high': '',
                '52_week_low': '',
                'avg_volume': ''
            }
            
            # Parse statistics tables
            tables = soup.select('table')
            for table in tables:
                rows = table.select('tr')
                for row in rows:
                    cells = row.select('td')
                    if len(cells) >= 2:
                        label = cells[0].text.strip().lower()
                        value = cells[1].text.strip()
                        
                        if 'market cap' in label:
                            stats['market_cap'] = value
                        elif 'trailing p/e' in label:
                            stats['pe_ratio'] = value
                        elif 'eps' in label and 'diluted' in label:
                            stats['eps'] = value
                        elif 'dividend yield' in label:
                            stats['dividend_yield'] = value
                        elif 'beta' in label:
                            stats['beta'] = value
                        elif '52 week high' in label:
                            stats['52_week_high'] = value
                        elif '52 week low' in label:
                            stats['52_week_low'] = value
                        elif 'avg vol' in label:
                            stats['avg_volume'] = value
            
            return stats
            
        except Exception as e:
            return {'error': str(e)}
    
    def scrape_news(self) -> list:
        """Scrape recent news from Yahoo Finance."""
        url = f"https://finance.yahoo.com/quote/{self.symbol}/news"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'lxml')
            
            news = []
            articles = soup.select('li.stream-item')[:5]  # Latest 5 news
            
            for article in articles:
                title_elem = article.select_one('h3')
                link_elem = article.select_one('a')
                source_elem = article.select_one('div.publishing')
                
                if title_elem:
                    news.append({
                        'title': title_elem.text.strip(),
                        'url': 'https://finance.yahoo.com' + link_elem.get('href', '') if link_elem else '',
                        'source': source_elem.text.strip() if source_elem else 'Yahoo Finance'
                    })
            
            return news
            
        except Exception as e:
            return [{'error': str(e)}]
    
    def get_full_intelligence(self) -> Dict[str, Any]:
        """Get complete company intelligence."""
        profile = self.scrape_yahoo_profile()
        stats = self.scrape_key_stats()
        news = self.scrape_news()
        
        return {
            'symbol': self.symbol,
            'timestamp': datetime.now().isoformat(),
            'profile': profile,
            'statistics': stats,
            'news': news,
            'source': 'Yahoo Finance'
        }


def main():
    parser = argparse.ArgumentParser(description='Scrape company intelligence data')
    parser.add_argument('symbol', nargs='?', help='Stock symbol (e.g., AAPL)')
    parser.add_argument('--symbol', '-s', dest='symbol_flag', help='Stock symbol (alternative)')
    parser.add_argument('--output', '-o', choices=['json', 'pretty'], default='json',
                       help='Output format')
    
    args = parser.parse_args()
    
    symbol = args.symbol or args.symbol_flag
    
    if not symbol:
        print("Error: Please provide a stock symbol", file=sys.stderr)
        print("Usage: python company_scraper.py AAPL", file=sys.stderr)
        sys.exit(1)
    
    scraper = CompanyScraper(symbol)
    data = scraper.get_full_intelligence()
    
    if args.output == 'pretty':
        print(json.dumps(data, indent=2))
    else:
        print(json.dumps(data))


if __name__ == '__main__':
    main()
