import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import adminService from "../../../services/adminService";

function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch stories from backend
  useEffect(() => {
    fetchSuccessStories();
  }, []);

  const fetchSuccessStories = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('💑 Fetching success stories from backend...');
      
      const response = await adminService.getSuccessStories();
      console.log('📥 Backend success stories response:', response);
      
      if (response.success && response.stories) {
        // Transform backend data to match frontend structure
        const transformedStories = response.stories.map((story, index) => ({
          id: story.id || index + 1,
          couple: {
            bride: {
              name: story.couple?.bride?.name || `User ${index * 2 + 1}`,
              age: story.couple?.bride?.age || 25 + (index % 10),
              profession: story.couple?.bride?.profession || 'Professional',
              joinedDate: story.couple?.bride?.joinedDate || '2023-01-15',
              email: story.couple?.bride?.email,
              city: story.couple?.bride?.city
            },
            groom: {
              name: story.couple?.groom?.name || `User ${index * 2 + 2}`,
              age: story.couple?.groom?.age || 28 + (index % 10),
              profession: story.couple?.groom?.profession || 'Professional',
              joinedDate: story.couple?.groom?.joinedDate || '2023-01-20',
              email: story.couple?.groom?.email,
              city: story.couple?.groom?.city
            }
          },
          story: story.story || 'Connected through our platform and found true love!',
          weddingDate: story.weddingDate || '2023-12-15',
          approved: story.approved !== undefined ? story.approved : true,
          featured: story.featured || false,
          likes: story.likes || 0,
          comments: story.comments || 0,
          shares: story.shares || 0,
          matchScore: story.matchScore || 85,
          meetingLocation: story.meetingLocation || 'Met Online',
          relationshipDuration: story.relationshipDuration || '6 months',
          // Keep original backend data
          backendData: story
        }));
        
        setStories(transformedStories);
        console.log('✅ Successfully loaded', transformedStories.length, 'stories from backend');
      } else {
        setError('No success stories found in backend response');
      }
    } catch (error) {
      console.error('❌ Error fetching success stories:', error);
      setError(`Failed to load success stories: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryAction = async (storyId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this success story?`)) {
      return;
    }

    try {
      setActionLoading(true);
      console.log(`🔄 Processing ${action} for story ${storyId}...`);
      
      let response;
      
      switch (action) {
        case 'approve':
          response = await adminService.approveSuccessStory(storyId);
          break;
        case 'reject':
          response = await adminService.rejectSuccessStory(storyId, 'Admin rejected');
          break;
        case 'feature':
          // Check current featured status
          const currentStory = stories.find(s => s.id === storyId);
          const newFeaturedStatus = !currentStory?.featured;
          // You need to add this method to adminService.js
          response = await adminService.featureSuccessStory(storyId, newFeaturedStatus);
          break;
        case 'delete':
          // You need to add delete method to adminService.js
          response = await adminService.deleteSuccessStory(storyId);
          break;
        default:
          throw new Error('Invalid action');
      }
      
      if (response.success) {
        // Update local state
        setStories(prev => {
          if (action === 'delete') {
            return prev.filter(story => story.id !== storyId);
          }
          
          return prev.map(story => 
            story.id === storyId 
              ? { 
                  ...story, 
                  approved: action === 'approve' ? true : 
                           action === 'reject' ? false : story.approved,
                  featured: action === 'feature' ? response.featured : story.featured
                }
              : story
          );
        });
        
        alert(`✅ Story ${action}ed successfully!`);
      } else {
        throw new Error(response.message || 'Backend error');
      }
    } catch (error) {
      console.error(`❌ Error ${action}ing story:`, error);
      alert(`❌ Failed to ${action} story: ${error.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredStories = stories.filter(story => {
    if (filter === 'featured') return story.featured;
    if (filter === 'pending') return !story.approved;
    return true;
  });

  // Calculate statistics
  const stats = {
    totalStories: stories.length,
    featuredStories: stories.filter(s => s.featured).length,
    pendingApproval: stories.filter(s => !s.approved).length,
    totalEngagement: stories.reduce((sum, story) => sum + story.likes + story.comments + story.shares, 0)
  };

  // Loading spinner
  if (loading && stories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading success stories from backend...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && stories.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Stories</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button 
          variant="primary" 
          onClick={fetchSuccessStories}
          className="px-4 py-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Backend Connection Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-700">
          💑 Showing <span className="font-bold">{filteredStories.length}</span> success stories from backend database
          {stories.length > 0 && (
            <span> • Total stories: <span className="font-bold">{stories.length}</span></span>
          )}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-purple-500">
          <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1 md:mb-2">
            {stats.totalStories}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Total Stories</div>
          <div className="text-xs text-gray-500 mt-1">From Database</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-yellow-500">
          <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1 md:mb-2">
            {stats.featuredStories}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Featured</div>
          <div className="text-xs text-gray-500 mt-1">⭐ Highlighted</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-blue-500">
          <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-2">
            {stats.pendingApproval}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Pending Approval</div>
          <div className="text-xs text-gray-500 mt-1">Needs Review</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-green-500">
          <div className="text-xl md:text-2xl font-bold text-green-600 mb-1 md:mb-2">
            {stats.totalEngagement}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Total Engagement</div>
          <div className="text-xs text-gray-500 mt-1">Likes + Comments + Shares</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Success Stories</h2>
              <p className="text-sm text-gray-600">
                Managing {stories.length} success stories from real matches
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                disabled={actionLoading}
              >
                <option value="all">All Stories</option>
                <option value="featured">Featured Only</option>
                <option value="pending">Pending Approval</option>
              </select>
              <Button 
                variant="primary" 
                size="sm"
                onClick={fetchSuccessStories}
                disabled={loading || actionLoading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Loading overlay */}
          {(loading && stories.length > 0) && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredStories.map((story) => (
              <div key={story.id} className={`border rounded-lg p-4 md:p-6 transition-all hover:shadow-md ${
                story.featured ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
              } ${!story.approved ? 'border-red-200 bg-red-50' : ''}`}>
                
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    {story.featured && (
                      <div className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-yellow-100 text-yellow-800 mb-2">
                        ⭐ Featured Story
                      </div>
                    )}
                    {!story.approved && (
                      <div className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-red-100 text-red-800 mb-2">
                        ⏳ Pending Approval
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs md:text-sm text-gray-500">Married</div>
                    <div className="text-xs md:text-sm font-medium text-gray-800">
                      {new Date(story.weddingDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Couple Information */}
                <div className="mb-3 md:mb-4">
                  <h3 className="font-semibold text-gray-800 text-base md:text-lg mb-2">
                    {story.couple.bride.name} & {story.couple.groom.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span>{story.couple.bride.profession} & {story.couple.groom.profession}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Match Score: <strong className="text-green-600">{story.matchScore}%</strong></span>
                    <span>•</span>
                    <span>Met in: <strong>{story.meetingLocation}</strong></span>
                    {story.backendData?.couple?.bride?.city && (
                      <span className="text-blue-600">📍 {story.backendData.couple.bride.city}</span>
                    )}
                  </div>
                </div>

                {/* Story Excerpt */}
                <p className="text-gray-600 text-sm mb-3 md:mb-4 line-clamp-3 leading-relaxed">
                  {story.story}
                </p>

                {/* Engagement Metrics */}
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      ❤️ {story.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      💬 {story.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      🔄 {story.shares}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    story.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {story.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-1 md:gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => window.alert(`Viewing story ${story.id} - ${story.couple.bride.name} & ${story.couple.groom.name}`)}
                    disabled={actionLoading}
                  >
                    View Full
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => handleStoryAction(story.id, 'feature')}
                    disabled={actionLoading}
                  >
                    {story.featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  {!story.approved && (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleStoryAction(story.id, 'approve')}
                      disabled={actionLoading}
                    >
                      Approve
                    </Button>
                  )}
                  {story.approved && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleStoryAction(story.id, 'reject')}
                      disabled={actionLoading}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredStories.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl md:text-5xl mb-4">💑</div>
              <p className="text-lg md:text-xl font-medium text-gray-600 mb-2">No stories found</p>
              <p className="text-sm md:text-base">
                {filter === 'featured' 
                  ? 'No featured stories available' 
                  : filter === 'pending'
                  ? 'No stories pending approval'
                  : 'No success stories available yet'
                }
              </p>
              <Button 
                variant="primary" 
                className="mt-4"
                onClick={fetchSuccessStories}
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Check Again'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Success Metrics */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Success Story Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{Math.round((stats.featuredStories / Math.max(stats.totalStories, 1)) * 100)}%</div>
            <div className="text-sm text-gray-600">Stories Featured</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.totalStories}</div>
            <div className="text-sm text-gray-600">Real Matches</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.totalEngagement}</div>
            <div className="text-sm text-gray-600">Total Engagement</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.totalStories > 0 ? Math.round(stats.totalEngagement / stats.totalStories) : 0}
            </div>
            <div className="text-sm text-gray-600">Avg. Engagement per Story</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessStories;