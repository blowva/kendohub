import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ onChange }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setQuery(e.target.value);
    onChange?.(e.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form className="search-bar" onSubmit={submit} role="search">
      <Search size={20} strokeWidth={1.5} className="sb-icon" />
      <input
        type="search"
        className="sb-input"
        placeholder="Search products, brands, categories..."
        value={query}
        onChange={handleChange}
        aria-label="Search products"
      />
    </form>
  );
}