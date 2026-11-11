import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlogPost } from '../../types';

interface BlogsState {
  blogs: BlogPost[];
}

export const initialBlogs: BlogPost[] = [
  {
    id: 'blog-1',
    title: '2026 Metropolitan Luxury Real Estate: Navigating Market Growth & Prime Urban Yields',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    type: 'Market Analysis',
    readTime: '5 min read',
    description: `<h2>The Evolution of Urban High-Rise Living in 2026</h2>
<p>As metropolitan hubs experience a resurgence of premium demand, luxury real estate investors and discerning residents are shifting priorities toward <strong>integrated smart residences</strong> and adaptable multi-bedroom living spaces.</p>
<blockquote>"Urban luxury is no longer defined solely by square footage, but by acoustic serenity, natural daylight orientation, and private outdoor balconies."</blockquote>
<h3>Key Market Catalysts</h3>
<ul>
  <li><strong>Flexible Tenancy Frameworks:</strong> Structured installment schedules are lowering barriers for top-tier corporate relocations.</li>
  <li><strong>Balcony & Outdoor Premium:</strong> Residences featuring 2 or more private terraces command up to 18% higher rental yield resilience.</li>
  <li><strong>Sustainable Energy Compliance:</strong> High-efficiency HVAC systems reduce operational maintenance fees by over 24%.</li>
</ul>
<p>At DPL Horizon, our portfolio curation focuses on strategic urban corridors offering long-term capital preservation alongside dependable monthly returns.</p>`,
    author: 'DPL Editorial Board',
    status: 'published',
    tags: ['Market Trends', 'Investment', 'Metropolitan', 'Luxury'],
    createdAt: '2026-03-01T10:30:00Z',
    updatedAt: '2026-03-01T10:30:00Z',
  },
  {
    id: 'blog-2',
    title: 'Biophilic Architectural Horizons: Integrating Green Terraces & Natural Light',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    type: 'Architecture & Design',
    readTime: '4 min read',
    description: `<h2>Breathing Life into Modern Concrete: The Biophilic Approach</h2>
<p>Contemporary residential architecture is moving away from sterile monoliths toward <em>living sanctuaries</em> that blend organic materials with expansive glazing and dedicated balcony zones.</p>
<h3>Why Multi-Balcony Layouts Matter</h3>
<p>Cross-ventilation between dual-facing balconies drastically reduces ambient cooling requirements while delivering uninterrupted panoramic city vistas.</p>
<ul>
  <li><strong>Master Bedroom Terraces:</strong> Private morning retreats tailored for personal mindfulness and botanical gardens.</li>
  <li><strong>Living Area Loggias:</strong> Seamless extensions for evening entertaining and open-air dining.</li>
</ul>
<p>DPL properties are engineered to maximize natural daylight corridors throughout the day, creating uplifting interior atmospheres with acoustic double-glazing.</p>`,
    author: 'Elena Vance, Head of Architecture',
    status: 'published',
    tags: ['Architecture', 'Biophilic', 'Design', 'Penthouse'],
    createdAt: '2026-02-24T14:15:00Z',
    updatedAt: '2026-02-24T14:15:00Z',
  },
  {
    id: 'blog-3',
    title: "The Strategic Investor's Guide to Multi-Unit Apartments & Installment Cashflows",
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    type: 'Investment Guide',
    readTime: '6 min read',
    description: `<h2>Maximizing Portfolio ROI Through Phased Lease Structures</h2>
<p>Investing in multi-unit residential buildings requires a rigorous understanding of unit-mix diversification and disciplined cash collection strategies.</p>
<blockquote>"A diversified building combining 1-bedroom executive units alongside 3-bedroom family suites ensures balanced seasonal occupancy and optimal net operating income."</blockquote>
<h3>Portfolio Optimization Checklist</h3>
<ol>
  <li><strong>Verify Unit Allocation:</strong> Balance high-turnover boutique suites with stable multi-year tenancies.</li>
  <li><strong>Deploy Scheduled Tranches:</strong> Quarterly or bi-annual installment agreements lower tenant default risks and maintain predictable treasury inflows.</li>
  <li><strong>Maintain Direct Management Access:</strong> Real-time oversight prevents deferred maintenance from eroding long-term equity.</li>
</ol>
<p>Investors utilizing DPL's administrative tracking system benefit from automated payment verification, tenant assignment records, and transparent milestone reporting.</p>`,
    author: 'Marcus Sterling, Capital Advisory',
    status: 'published',
    tags: ['Finance', 'ROI', 'Multi-Unit', 'Installments'],
    createdAt: '2026-02-18T09:00:00Z',
    updatedAt: '2026-02-18T09:00:00Z',
  },
  {
    id: 'blog-4',
    title: 'Smart Concierge & Sustainable Living: The New Standard for DPL Residences',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    type: 'Luxury Lifestyle',
    readTime: '3 min read',
    description: `<h2>The Synergy of Opulence and Eco-Conscious Engineering</h2>
<p>Eco-conscious architectural standards have graduated from niche luxury into a baseline expectation for high-net-worth tenants worldwide.</p>
<p>Smart climate zoning, EV charging infrastructure, touchless private elevator access, and double-glazed low-E thermal insulation harmonize everyday comfort with measurable carbon reduction.</p>
<p>Every apartment in the DPL portfolio is designed around seamless connectivity, allowing residents and administrators to coordinate services with uncompromised privacy.</p>`,
    author: 'DPL Lifestyle Desk',
    status: 'draft',
    tags: ['Lifestyle', 'Smart Home', 'Green Living'],
    createdAt: '2026-02-10T16:45:00Z',
    updatedAt: '2026-02-10T16:45:00Z',
  },
];

const loadInitialBlogs = (): BlogPost[] => {
  try {
    const saved = localStorage.getItem('dpl_blogs');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load blogs from localStorage', e);
  }
  return initialBlogs;
};

const initialState: BlogsState = {
  blogs: loadInitialBlogs(),
};

const saveBlogs = (blogs: BlogPost[]) => {
  try {
    localStorage.setItem('dpl_blogs', JSON.stringify(blogs));
  } catch (e) {
    console.error('Failed to save blogs', e);
  }
};

export const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    addBlog: (
      state,
      action: PayloadAction<Omit<BlogPost, 'id' | 'createdAt'>>
    ) => {
      const newBlog: BlogPost = {
        id: `blog-${Date.now()}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.blogs.unshift(newBlog);
      saveBlogs(state.blogs);
    },
    updateBlog: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Omit<BlogPost, 'id' | 'createdAt'>> }>
    ) => {
      const blog = state.blogs.find((b) => b.id === action.payload.id);
      if (blog) {
        Object.assign(blog, action.payload.data, {
          updatedAt: new Date().toISOString(),
        });
        saveBlogs(state.blogs);
      }
    },
    deleteBlog: (state, action: PayloadAction<string>) => {
      state.blogs = state.blogs.filter((b) => b.id !== action.payload);
      saveBlogs(state.blogs);
    },
    toggleBlogStatus: (state, action: PayloadAction<string>) => {
      const blog = state.blogs.find((b) => b.id === action.payload);
      if (blog) {
        blog.status = blog.status === 'published' ? 'draft' : 'published';
        blog.updatedAt = new Date().toISOString();
        saveBlogs(state.blogs);
      }
    },
    resetBlogsToDefault: (state) => {
      state.blogs = initialBlogs;
      saveBlogs(state.blogs);
    },
  },
});

export const {
  addBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  resetBlogsToDefault,
} = blogsSlice.actions;

export default blogsSlice.reducer;
