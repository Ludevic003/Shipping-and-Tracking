import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Search, ArrowRight, FileText, HelpCircle, Package, ShieldCheck, AlertCircle, ChevronRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);

  // Static searchable content database
  const searchableContent = [
    { id: 1, title: 'Track Shipment', type: 'Tool', path: '/#track', icon: Package, desc: 'Enter your tracking number to get real-time updates on your package location.' },
    { id: 2, title: 'Insurance Policy', type: 'Page', path: '/insurance', icon: ShieldCheck, desc: 'Learn about our comprehensive insurance coverage for standard and high-value items.' },
    { id: 3, title: 'Live Animal Shipping', type: 'Service', path: '/live-animal-shipping', icon: AlertCircle, desc: 'Specialized logistics for safe, climate-controlled transportation of live animals.' },
    { id: 4, title: 'Contact Support', type: 'Page', path: '/contact', icon: FileText, desc: 'Get in touch with our 24/7 global support team for assistance with your shipments.' },
    { id: 5, title: 'About Us', type: 'Page', path: '/about', icon: FileText, desc: 'Discover our global logistics network and commitment to reliable delivery.' },
    { id: 6, title: 'Terms of Service', type: 'Legal', path: '/terms', icon: FileText, desc: 'Read the terms and conditions governing our mail forwarding and shipping services.' },
    { id: 7, title: 'How do I track my shipment?', type: 'FAQ', path: '/faq', icon: HelpCircle, desc: 'You can track your shipment by entering your tracking number on our homepage.' },
    { id: 8, title: 'What is your insurance coverage?', type: 'FAQ', path: '/faq', icon: HelpCircle, desc: 'We offer comprehensive insurance at 15% of the declared value (100% for live animals).' },
    { id: 9, title: 'How much does shipping cost?', type: 'FAQ', path: '/faq', icon: HelpCircle, desc: 'Shipping costs vary based on weight, dimensions, destination, and service level.' },
    { id: 10, title: 'How do I submit a complaint?', type: 'FAQ', path: '/faq', icon: HelpCircle, desc: 'Log into your client dashboard to submit a detailed complaint ticket.' },
    { id: 11, title: 'Client Dashboard', type: 'Portal', path: '/dashboard/client', icon: Package, desc: 'Manage your active shipments, view history, and submit support tickets.' }
  ];

  const commonSearches = ['Tracking', 'Insurance', 'Pricing', 'Complaints', 'Live Animals', 'Contact'];

  useEffect(() => {
    if (initialQuery) {
      const lowerQuery = initialQuery.toLowerCase();
      const filtered = searchableContent.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.desc.toLowerCase().includes(lowerQuery) ||
        item.type.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSearchParams({ q: suggestion });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Search Results {initialQuery ? `for "${initialQuery}"` : ''} - US Box Mail Services</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-12 md:py-20">
        <div className="container-custom max-w-4xl">
          
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Search Results
            </h1>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for tracking, insurance, FAQs..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-white shadow-sm rounded-xl"
                  autoFocus
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 rounded-xl">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground mr-2">Popular searches:</span>
              {commonSearches.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(term)}
                  className="text-xs font-medium bg-secondary/50 hover:bg-secondary text-foreground px-3 py-1.5 rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {initialQuery && (
            <div className="mb-8">
              <p className="text-muted-foreground">
                Showing results for <span className="font-semibold text-foreground">"{initialQuery}"</span>
              </p>
            </div>
          )}

          {!initialQuery ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-border/50 shadow-sm">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">What are you looking for?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter a search term above to find pages, services, and answers to frequently asked questions.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-border/50 shadow-sm">
              <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                We couldn't find anything matching "{initialQuery}". Try checking your spelling or using more general terms.
              </p>
              <Button variant="outline" onClick={() => navigate('/404')}>
                Return to Help Center
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => {
                const Icon = result.icon;
                return (
                  <Link key={result.id} to={result.path} className="block group">
                    <Card className="border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 bg-white">
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
                              {result.type}
                            </span>
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                              {result.title}
                            </h3>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {result.desc}
                          </p>
                        </div>
                        <div className="shrink-0 self-center hidden sm:block">
                          <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;