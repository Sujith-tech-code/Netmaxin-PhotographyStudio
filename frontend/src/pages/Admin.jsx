import { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Key,
  Calendar,
  Mail,
  User,
  Camera,
  Trash2,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  Edit2,
  Eye,
  RefreshCw,
  Search,
  Filter,
  AlertCircle,
  Database,
  Printer,
  ChevronDown
} from 'lucide-react';
import Stamp from '../components/Stamp';
import {
  verifyAdminPasskey,
  fetchAdminBookings,
  updateBookingStatus,
  deleteBooking,
  fetchGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  fetchAdminStats,
  fetchPricing
} from '../services/api';
import './Admin.css';

const DEFAULT_PASSKEY = 'aperture2026';

const Admin = () => {
  // Authentication State
  const [passkey, setPasskey] = useState(sessionStorage.getItem('aperture_admin_passkey') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPasskey, setInputPasskey] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);

  // Active Tab: 'bookings' | 'gallery' | 'stats'
  const [activeTab, setActiveTab] = useState('bookings');

  // Ledger / Bookings State
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sessionFilter, setSessionFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null); // For detail modal
  const [deleteBookingId, setDeleteBookingId] = useState(null); // For delete modal

  // Gallery Management State
  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingFrame, setEditingFrame] = useState(null);
  const [frameFormData, setFrameFormData] = useState({
    title: '',
    category: 'Portrait',
    description: '',
    imageUrl: '',
    aspectRatio: 'portrait',
    location: 'Studio Loft 4B',
    year: '2026',
    shutter: '1/125s',
    aperture: 'f/2.8',
    iso: 'ISO 400'
  });

  // Overview Stats State
  const [adminStats, setAdminStats] = useState(null);
  const [pricingData, setPricingData] = useState(null);

  // Toast / Feedback message
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Attempt auto-login if passkey was already in sessionStorage
  useEffect(() => {
    if (passkey) {
      handleVerify(passkey, false);
    }
  }, []);

  const handleVerify = async (keyToTest, setAsInput = true) => {
    setIsVerifying(true);
    setAuthError('');
    try {
      const res = await verifyAdminPasskey(keyToTest);
      if (res.success) {
        setIsAuthenticated(true);
        setPasskey(keyToTest);
        sessionStorage.setItem('aperture_admin_passkey', keyToTest);
        loadAllData(keyToTest);
      } else {
        setAuthError(res.message || 'Incorrect passkey');
        if (!setAsInput) sessionStorage.removeItem('aperture_admin_passkey');
      }
    } catch (err) {
      setAuthError(err.message || 'Invalid passkey. Access denied.');
      if (!setAsInput) sessionStorage.removeItem('aperture_admin_passkey');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasskey('');
    setInputPasskey('');
    sessionStorage.removeItem('aperture_admin_passkey');
    showToast('Studio Ledger locked successfully.');
  };

  const loadAllData = async (currentKey = passkey) => {
    setLoadingBookings(true);
    setLoadingGallery(true);
    try {
      const [bookingsData, galleryData, statsData, pricing] = await Promise.all([
        fetchAdminBookings(currentKey),
        fetchGallery(),
        fetchAdminStats(currentKey),
        fetchPricing()
      ]);
      setBookings(bookingsData);
      setGalleryItems(galleryData);
      setAdminStats(statsData);
      setPricingData(pricing);
    } catch (err) {
      console.error('Error loading admin ledger data:', err);
    } finally {
      setLoadingBookings(false);
      setLoadingGallery(false);
    }
  };

  // Filter Bookings logic
  useEffect(() => {
    let result = [...bookings];

    if (statusFilter !== 'all') {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (sessionFilter !== 'all') {
      result = result.filter(
        (b) => b.sessionType?.toLowerCase() === sessionFilter.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.clientName?.toLowerCase().includes(query) ||
          b.clientEmail?.toLowerCase().includes(query) ||
          b.message?.toLowerCase().includes(query) ||
          b.preferredDate?.toLowerCase().includes(query)
      );
    }

    setFilteredBookings(result);
  }, [bookings, statusFilter, sessionFilter, searchQuery]);

  // Update Status of a Booking
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, newStatus, passkey);
      setBookings((prev) =>
        prev.map((b) => (b._id === id || b.id === id ? { ...b, status: newStatus } : b))
      );
      showToast(`Sitting status marked as '${newStatus.toUpperCase()}'.`);
      // Refresh stats
      fetchAdminStats(passkey).then(setAdminStats).catch(() => {});
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Delete a Booking
  const handleDeleteBooking = async (id) => {
    try {
      await deleteBooking(id, passkey);
      setBookings((prev) => prev.filter((b) => b._id !== id && b.id !== id));
      setDeleteBookingId(null);
      if (selectedBooking && (selectedBooking._id === id || selectedBooking.id === id)) {
        setSelectedBooking(null);
      }
      showToast('Sitting entry removed from studio ledger.');
      fetchAdminStats(passkey).then(setAdminStats).catch(() => {});
    } catch (err) {
      alert('Failed to delete booking: ' + err.message);
    }
  };

  // Export Bookings to CSV
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      alert('No bookings in ledger to export.');
      return;
    }

    const headers = ['Entry ID', 'Client Name', 'Email', 'Session Type', 'Preferred Date', 'Status', 'Date Submitted', 'Message'];
    const rows = bookings.map((b) => [
      `"${b._id || b.id || ''}"`,
      `"${(b.clientName || '').replace(/"/g, '""')}"`,
      `"${(b.clientEmail || '').replace(/"/g, '""')}"`,
      `"${b.sessionType || ''}"`,
      `"${(b.preferredDate || '').replace(/"/g, '""')}"`,
      `"${b.status || 'inquiry'}"`,
      `"${new Date(b.createdAt || Date.now()).toLocaleDateString()}"`,
      `"${(b.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Aperture_and_Ash_Studio_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Ledger exported as CSV successfully.');
  };

  // Gallery Frame Form Handlers
  const handleOpenAddFrame = () => {
    setEditingFrame(null);
    setFrameFormData({
      title: '',
      category: 'Portrait',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      aspectRatio: 'portrait',
      location: 'Studio Loft 4B',
      year: '2026',
      shutter: '1/125s',
      aperture: 'f/2.8',
      iso: 'ISO 400'
    });
    setGalleryModalOpen(true);
  };

  const handleOpenEditFrame = (frame) => {
    setEditingFrame(frame);
    setFrameFormData({
      title: frame.title || '',
      category: frame.category || 'Portrait',
      description: frame.description || '',
      imageUrl: frame.imageUrl || '',
      aspectRatio: frame.aspectRatio || 'portrait',
      location: frame.location || 'Studio Loft 4B',
      year: frame.year || '2026',
      shutter: frame.shutter || '1/125s',
      aperture: frame.aperture || 'f/2.8',
      iso: frame.iso || 'ISO 400'
    });
    setGalleryModalOpen(true);
  };

  const handleSaveFrame = async (e) => {
    e.preventDefault();
    if (!frameFormData.title.trim()) {
      alert('Please provide a frame title');
      return;
    }

    try {
      if (editingFrame) {
        const frameId = editingFrame.id || editingFrame._id;
        const updated = await updateGalleryItem(frameId, frameFormData, passkey);
        setGalleryItems((prev) =>
          prev.map((g) => (g.id === frameId || g._id === frameId ? { ...g, ...frameFormData } : g))
        );
        showToast(`Frame '${frameFormData.title}' updated successfully.`);
      } else {
        const created = await createGalleryItem(frameFormData, passkey);
        setGalleryItems((prev) => [...prev, created]);
        showToast(`New frame '${frameFormData.title}' added to gallery.`);
      }
      setGalleryModalOpen(false);
    } catch (err) {
      alert('Failed to save gallery frame: ' + err.message);
    }
  };

  const handleDeleteFrame = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove '${title}' from the darkroom gallery?`)) {
      return;
    }
    try {
      await deleteGalleryItem(id, passkey);
      setGalleryItems((prev) => prev.filter((g) => g.id !== id && g._id !== id));
      showToast(`Frame '${title}' removed.`);
    } catch (err) {
      alert('Failed to delete frame: ' + err.message);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'confirmed':
        return 'olive';
      case 'contacted':
        return 'ochre';
      case 'completed':
        return 'olive';
      case 'archived':
        return 'faint';
      case 'inquiry':
      default:
        return 'rust';
    }
  };

  // ------------------------------------------------------------------------
  // 1. Passkey Lock Screen View
  // ------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="admin-page admin-gate-page">
        <div className="container container-narrow">
          <div className="admin-lock-card">
            <div className="lock-icon-wrapper">
              <Lock size={40} className="lock-icon" />
            </div>

            <div className="lock-header">
              <span className="typewriter-label">CONFIDENTIAL ARCHIVES</span>
              <h2>Studio Ledger Access</h2>
              <p>
                Enter the master administrative passkey to inspect sitting inquiries, client records, and darkroom archives.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify(inputPasskey);
              }}
              className="admin-passkey-form"
            >
              {authError && (
                <div className="admin-auth-error">
                  <AlertCircle size={18} />
                  <span>{authError}</span>
                </div>
              )}

              <div className="passkey-input-group">
                <label htmlFor="passkey" className="form-label">
                  <Key size={15} />
                  <span>Studio Passkey</span>
                </label>
                <div className="passkey-field-wrapper">
                  <input
                    type={showPasskey ? 'text' : 'password'}
                    id="passkey"
                    value={inputPasskey}
                    onChange={(e) => setInputPasskey(e.target.value)}
                    placeholder="Enter passkey (e.g. aperture2026)"
                    className="form-input passkey-input"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="passkey-toggle-btn"
                    onClick={() => setShowPasskey(!showPasskey)}
                  >
                    {showPasskey ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="passkey-actions">
                <button
                  type="submit"
                  disabled={isVerifying || !inputPasskey.trim()}
                  className="btn btn-primary btn-unlock"
                >
                  <Unlock size={16} />
                  <span>{isVerifying ? 'Verifying...' : 'Unlock Studio Ledger'}</span>
                </button>
              </div>

              <div className="passkey-hint-box">
                <p>
                  Default setup passkey: <code>{DEFAULT_PASSKEY}</code>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setInputPasskey(DEFAULT_PASSKEY);
                    handleVerify(DEFAULT_PASSKEY);
                  }}
                  className="btn-link-hint"
                >
                  Use Default Passkey &amp; Open
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------------
  // 2. Authenticated Admin Dashboard View
  // ------------------------------------------------------------------------
  return (
    <div className="admin-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Ledger Header */}
      <div className="admin-header-bar">
        <div className="container admin-header-inner">
          <div className="admin-title-area">
            <div className="admin-brand-stamp">
              <Stamp variant="rust">STUDIO LEDGER &amp; ARCHIVES</Stamp>
              <span className="db-indicator">
                <Database size={13} />
                <span>
                  {adminStats?.databaseState === 'connected'
                    ? 'MongoDB Active'
                    : 'In-Memory Ledger'}
                </span>
              </span>
            </div>
            <h1>Aperture &amp; Ash Administration</h1>
          </div>

          <div className="admin-header-controls">
            <button
              onClick={() => loadAllData(passkey)}
              className="btn btn-secondary btn-sm"
              title="Refresh ledger records"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm btn-logout"
              title="Lock studio ledger"
            >
              <Lock size={14} />
              <span>Lock Ledger</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={16} />
            <span>Sittings Ledger</span>
            <span className="tab-count-badge">{bookings.length}</span>
          </button>
          <button
            className={`admin-tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <Camera size={16} />
            <span>Gallery Curations</span>
            <span className="tab-count-badge">{galleryItems.length}</span>
          </button>
          <button
            className={`admin-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <Eye size={16} />
            <span>Studio Overview &amp; Rates</span>
          </button>
        </div>

        {/* ------------------------------------------------------------------
            TAB 1: BOOKINGS & SITTINGS LEDGER
           ------------------------------------------------------------------ */}
        {activeTab === 'bookings' && (
          <div className="admin-tab-content">
            {/* Quick Metrics Bar */}
            <div className="admin-metrics-row">
              <div className="metric-box">
                <span className="metric-label">Total Sittings</span>
                <span className="metric-val">{bookings.length}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Pending Inquiries</span>
                <span className="metric-val text-rust">
                  {bookings.filter((b) => b.status === 'inquiry').length}
                </span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Contacted</span>
                <span className="metric-val text-ochre">
                  {bookings.filter((b) => b.status === 'contacted').length}
                </span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Confirmed / Sittings</span>
                <span className="metric-val text-olive">
                  {bookings.filter((b) => b.status === 'confirmed').length}
                </span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Pipeline Value</span>
                <span className="metric-val">
                  ₹{adminStats?.pipelineRevenue?.toLocaleString() || '15,000'}
                </span>
              </div>
            </div>

            {/* Filter & Action Toolbar */}
            <div className="ledger-toolbar">
              <div className="search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search client, email, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="toolbar-filters">
                {/* Status Pills */}
                <div className="status-pill-group">
                  <span className="filter-label">
                    <Filter size={13} />
                    <span>Status:</span>
                  </span>
                  {['all', 'inquiry', 'contacted', 'confirmed', 'completed', 'archived'].map((st) => (
                    <button
                      key={st}
                      className={`pill-btn ${statusFilter === st ? 'active' : ''}`}
                      onClick={() => setStatusFilter(st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Session Type Select */}
                <select
                  value={sessionFilter}
                  onChange={(e) => setSessionFilter(e.target.value)}
                  className="toolbar-select"
                >
                  <option value="all">All Categories</option>
                  <option value="portrait">Portrait</option>
                  <option value="wedding">Wedding</option>
                  <option value="commercial">Commercial</option>
                  <option value="editorial">Editorial</option>
                  <option value="still-life">Still Life</option>
                  <option value="other">Other</option>
                </select>

                {/* Export & Print */}
                <button onClick={handleExportCSV} className="btn btn-secondary btn-sm" title="Export CSV">
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
                <button onClick={() => window.print()} className="btn btn-secondary btn-sm" title="Print Ledger">
                  <Printer size={14} />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Bookings Ledger Table */}
            {loadingBookings ? (
              <div className="admin-loading-state">
                <p className="typewriter-label">Transcribing studio ledger records...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="empty-ledger-state">
                <Clock size={32} />
                <h3>No entries found</h3>
                <p>No sitting inquiries match your filter or search query.</p>
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setSessionFilter('all');
                    setSearchQuery('');
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="ledger-table-container">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th>Ref / Date</th>
                      <th>Client Name &amp; Contact</th>
                      <th>Commission Category</th>
                      <th>Preferred Date</th>
                      <th>Status Management</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => {
                      const id = b._id || b.id;
                      const dateStr = b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Recent';

                      return (
                        <tr key={id} className={`ledger-row status-${b.status || 'inquiry'}`}>
                          {/* Ref & Date */}
                          <td className="col-ref">
                            <span className="entry-ref">
                              {id ? `AA-${id.slice(-5).toUpperCase()}` : 'AA-LOG'}
                            </span>
                            <span className="entry-date">{dateStr}</span>
                          </td>

                          {/* Client Info */}
                          <td className="col-client">
                            <div className="client-name">{b.clientName}</div>
                            <a
                              href={`mailto:${b.clientEmail}?subject=Regarding Your Aperture %26 Ash Sitting Inquiry`}
                              className="client-email"
                            >
                              <Mail size={12} />
                              <span>{b.clientEmail}</span>
                            </a>
                          </td>

                          {/* Session Category */}
                          <td className="col-category">
                            <span className="category-tag text-uppercase">
                              {b.sessionType || 'Portrait'}
                            </span>
                          </td>

                          {/* Preferred Date */}
                          <td className="col-date">
                            <span>{b.preferredDate || 'Flexible / To discuss'}</span>
                          </td>

                          {/* Status Management Dropdown */}
                          <td className="col-status">
                            <div className="status-select-wrap">
                              <Stamp variant={getStatusBadgeVariant(b.status || 'inquiry')}>
                                {(b.status || 'inquiry').toUpperCase()}
                              </Stamp>
                              <select
                                value={b.status || 'inquiry'}
                                onChange={(e) => handleStatusChange(id, e.target.value)}
                                className="status-dropdown"
                              >
                                <option value="inquiry">Inquiry (Pending)</option>
                                <option value="contacted">Contacted</option>
                                <option value="confirmed">Confirmed Sitting</option>
                                <option value="completed">Completed / Scanned</option>
                                <option value="archived">Archived</option>
                              </select>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="col-actions">
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="action-btn view-btn"
                              title="Inspect full inquiry notes"
                            >
                              <Eye size={15} />
                              <span>Details</span>
                            </button>
                            <button
                              onClick={() => setDeleteBookingId(id)}
                              className="action-btn delete-btn"
                              title="Delete sitting entry"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------
            TAB 2: GALLERY CURATIONS & FRAMES MANAGEMENT
           ------------------------------------------------------------------ */}
        {activeTab === 'gallery' && (
          <div className="admin-tab-content">
            <div className="gallery-mgmt-header">
              <div>
                <span className="typewriter-label">DARKROOM PROOF REPOSITORY</span>
                <h2>Active Contact Sheet Frames ({galleryItems.length})</h2>
                <p>Add, reorder, or update photo frames displayed across the public gallery and home showcase.</p>
              </div>
              <button onClick={handleOpenAddFrame} className="btn btn-primary">
                <Plus size={16} />
                <span>Add New Photo Frame</span>
              </button>
            </div>

            {loadingGallery ? (
              <div className="admin-loading-state">
                <p className="typewriter-label">Developing frame inventory...</p>
              </div>
            ) : (
              <div className="admin-gallery-grid">
                {galleryItems.map((frame, idx) => {
                  const frameId = frame.id || frame._id;
                  return (
                    <div key={frameId || idx} className="admin-gallery-card">
                      <div
                        className="admin-frame-preview"
                        style={{
                          backgroundImage: frame.imageUrl ? `url(${frame.imageUrl})` : undefined
                        }}
                      >
                        <span className="admin-frame-badge">
                          {frame.frameNumber || `EXP 0${idx + 1}`} • {frame.category}
                        </span>
                      </div>

                      <div className="admin-frame-info">
                        <h4>{frame.title}</h4>
                        <p className="frame-meta-line">
                          <span>{frame.aspectRatio || 'portrait'}</span> •{' '}
                          <span>{frame.location || 'Studio'}</span> •{' '}
                          <span>{frame.year || '2026'}</span>
                        </p>
                        <p className="frame-desc-snippet">{frame.description}</p>

                        <div className="admin-frame-actions">
                          <button
                            onClick={() => handleOpenEditFrame(frame)}
                            className="btn btn-secondary btn-sm"
                          >
                            <Edit2 size={14} />
                            <span>Edit Frame</span>
                          </button>
                          <button
                            onClick={() => handleDeleteFrame(frameId, frame.title)}
                            className="btn btn-secondary btn-sm btn-delete-frame"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------
            TAB 3: STUDIO STATS & PRICING OVERVIEW
           ------------------------------------------------------------------ */}
        {activeTab === 'stats' && (
          <div className="admin-tab-content">
            <div className="studio-overview-grid">
              {/* Studio Capacity Box */}
              <div className="overview-card">
                <span className="typewriter-label">OPERATING CAPACITY</span>
                <h3>Monthly Sitting Threshold</h3>
                <p>
                  To preserve darkroom artisanal standards and individual care, the studio accepts a maximum of{' '}
                  <strong>6 Sittings / Month</strong>.
                </p>

                <div className="capacity-meter-box">
                  <div className="capacity-bar-bg">
                    <div
                      className="capacity-bar-fill"
                      style={{
                        width: `${Math.min(
                          ((bookings.filter((b) => b.status === 'confirmed').length || 1) / 6) * 100,
                          100
                        )}%`
                      }}
                    />
                  </div>
                  <div className="capacity-text">
                    <span>
                      {bookings.filter((b) => b.status === 'confirmed').length} of 6 Confirmed Sittings
                    </span>
                    <span>
                      {Math.max(0, 6 - bookings.filter((b) => b.status === 'confirmed').length)} Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Pricing Tiers Card */}
              <div className="overview-card">
                <span className="typewriter-label">CURRENT RATE CARDS</span>
                <h3>Sitting Rates &amp; Tiers</h3>
                <div className="rates-mini-list">
                  {pricingData?.tiers?.map((tier) => (
                    <div key={tier.id} className="rate-mini-item">
                      <div>
                        <strong>{tier.name}</strong>
                        <span className="rate-period"> — {tier.duration}</span>
                      </div>
                      <span className="rate-price">{tier.priceFormatted}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Connection Summary */}
            <div className="system-status-box">
              <h4>Studio System &amp; Database Health</h4>
              <div className="system-health-grid">
                <div className="health-item">
                  <span className="health-label">DATABASE STATE</span>
                  <span className="health-val">
                    {adminStats?.databaseState === 'connected' ? 'Connected (MongoDB Atlas/Local)' : 'In-Memory Local Fallback'}
                  </span>
                </div>
                <div className="health-item">
                  <span className="health-label">API SERVER</span>
                  <span className="health-val">Node.js Express / Port 5000</span>
                </div>
                <div className="health-item">
                  <span className="health-label">PASSKEY ENCRYPTION</span>
                  <span className="health-val">Active (Protected Routes)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------
          DETAIL MODAL: INSPECT SITTING MESSAGE & NOTES
         -------------------------------------------------------------------- */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content ledger-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <Stamp variant="rust">STUDIO SITTING DOSSIER</Stamp>
                <h3>{selectedBooking.clientName}</h3>
              </div>
              <button className="modal-close" onClick={() => setSelectedBooking(null)}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="receipt-box modal-receipt">
                <div className="receipt-row">
                  <span className="receipt-label">ENTRY ID:</span>
                  <span className="receipt-value">{selectedBooking._id || selectedBooking.id}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">CLIENT EMAIL:</span>
                  <span className="receipt-value">{selectedBooking.clientEmail}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">COMMISSION TYPE:</span>
                  <span className="receipt-value text-uppercase">{selectedBooking.sessionType}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">PREFERRED TIMEFRAME:</span>
                  <span className="receipt-value">{selectedBooking.preferredDate || 'Flexible'}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">DATE LOGGED:</span>
                  <span className="receipt-value">
                    {selectedBooking.createdAt
                      ? new Date(selectedBooking.createdAt).toLocaleString()
                      : 'Recently'}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">STATUS:</span>
                  <span className="receipt-value text-accent text-uppercase">
                    {selectedBooking.status || 'inquiry'}
                  </span>
                </div>
              </div>

              <div className="client-message-card">
                <h5>Client Project Goals &amp; Sitting Notes:</h5>
                <p className="client-message-text">"{selectedBooking.message}"</p>
              </div>

              <div className="modal-actions-row">
                <a
                  href={`mailto:${selectedBooking.clientEmail}?subject=Regarding Your Aperture %26 Ash Sitting Inquiry`}
                  className="btn btn-primary"
                >
                  <Mail size={15} />
                  <span>Compose Direct Reply</span>
                </a>
                <button
                  onClick={() => {
                    handleStatusChange(
                      selectedBooking._id || selectedBooking.id,
                      selectedBooking.status === 'confirmed' ? 'completed' : 'confirmed'
                    );
                    setSelectedBooking(null);
                  }}
                  className="btn btn-olive"
                >
                  <CheckCircle2 size={15} />
                  <span>
                    {selectedBooking.status === 'confirmed'
                      ? 'Mark as Completed'
                      : 'Confirm Sitting'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------
          MODAL: ADD / EDIT GALLERY PHOTO FRAME
         -------------------------------------------------------------------- */}
      {galleryModalOpen && (
        <div className="modal-overlay" onClick={() => setGalleryModalOpen(false)}>
          <div className="modal-content gallery-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <Stamp variant="ochre">DARKROOM REPOSITORY</Stamp>
                <h3>{editingFrame ? 'Edit Photo Frame' : 'Add New Photo Frame'}</h3>
              </div>
              <button className="modal-close" onClick={() => setGalleryModalOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveFrame} className="gallery-edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Frame Title *</label>
                  <input
                    type="text"
                    required
                    value={frameFormData.title}
                    onChange={(e) =>
                      setFrameFormData({ ...frameFormData, title: e.target.value })
                    }
                    placeholder="e.g. The Watchmaker at Dusk"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={frameFormData.category}
                    onChange={(e) =>
                      setFrameFormData({ ...frameFormData, category: e.target.value })
                    }
                    className="form-select"
                  >
                    <option value="Portrait">Portrait</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Still Life">Still Life</option>
                    <option value="Candid">Candid</option>
                    <option value="Editorial">Editorial</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (High-Resolution Film Photo)</label>
                <input
                  type="url"
                  value={frameFormData.imageUrl}
                  onChange={(e) =>
                    setFrameFormData({ ...frameFormData, imageUrl: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                />
              </div>

              {frameFormData.imageUrl && (
                <div className="image-preview-box">
                  <span className="typewriter-label">Frame Live Preview</span>
                  <div
                    className="preview-img-frame"
                    style={{ backgroundImage: `url(${frameFormData.imageUrl})` }}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Description &amp; Story</label>
                <textarea
                  rows={3}
                  value={frameFormData.description}
                  onChange={(e) =>
                    setFrameFormData({ ...frameFormData, description: e.target.value })
                  }
                  placeholder="Details about the light, film stock, camera apparatus..."
                  className="form-textarea"
                />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Shutter Speed</label>
                  <input
                    type="text"
                    value={frameFormData.shutter}
                    onChange={(e) =>
                      setFrameFormData({ ...frameFormData, shutter: e.target.value })
                    }
                    placeholder="1/125s"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Aperture</label>
                  <input
                    type="text"
                    value={frameFormData.aperture}
                    onChange={(e) =>
                      setFrameFormData({ ...frameFormData, aperture: e.target.value })
                    }
                    placeholder="f/2.8"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Film Stock / ISO</label>
                  <input
                    type="text"
                    value={frameFormData.iso}
                    onChange={(e) =>
                      setFrameFormData({ ...frameFormData, iso: e.target.value })
                    }
                    placeholder="ISO 400"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>{editingFrame ? 'Update Frame' : 'Save New Frame'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------
          DELETE CONFIRMATION MODAL
         -------------------------------------------------------------------- */}
      {deleteBookingId && (
        <div className="modal-overlay" onClick={() => setDeleteBookingId(null)}>
          <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <Stamp variant="rust">ARCHIVE DELETION</Stamp>
                <h3>Remove Sitting Record?</h3>
              </div>
              <button className="modal-close" onClick={() => setDeleteBookingId(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you wish to permanently remove this sitting inquiry from the studio ledger? This action cannot be undone.
              </p>
              <div className="modal-actions-row">
                <button
                  onClick={() => setDeleteBookingId(null)}
                  className="btn btn-secondary"
                >
                  Keep Record
                </button>
                <button
                  onClick={() => handleDeleteBooking(deleteBookingId)}
                  className="btn btn-primary btn-danger"
                >
                  <Trash2 size={15} />
                  <span>Delete From Ledger</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
