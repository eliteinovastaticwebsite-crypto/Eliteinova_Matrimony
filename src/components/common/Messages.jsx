import { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  EllipsisHorizontalIcon,
  CheckIcon,
  BellIcon,
  UserIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Adjust based on your auth

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockConversations = [
      {
        id: '1',
        userId: 'user2',
        userName: 'Priya Sharma',
        userAvatar: '/api/placeholder/50/50',
        lastMessage: 'Hello! How are you?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unreadCount: 2,
        isOnline: true
      },
      {
        id: '2',
        userId: 'user3',
        userName: 'Anjali Reddy',
        userAvatar: '/api/placeholder/50/50',
        lastMessage: 'Thanks for connecting!',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        unreadCount: 0,
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 3)
      },
      {
        id: '3',
        userId: 'user4',
        userName: 'Emma Davis',
        userAvatar: '/api/placeholder/50/50',
        lastMessage: 'Would love to grab coffee sometime! 🎉',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        unreadCount: 1,
        isOnline: true
      }
    ];
    setConversations(mockConversations);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      // Mock messages - replace with actual API call
      const mockMessages = [
        {
          id: '1',
          senderId: 'user2',
          receiverId: 'currentUser',
          content: 'Hey there! I saw we have a lot in common 😊',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          read: true,
          type: 'text'
        },
        {
          id: '2',
          senderId: 'currentUser',
          receiverId: 'user2',
          content: 'Hi Priya! Yes, I noticed that too. Love your profile!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
          read: true,
          type: 'text'
        },
        {
          id: '3',
          senderId: 'user2',
          receiverId: 'currentUser',
          content: 'Thanks! How was your weekend?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: true,
          type: 'text'
        },
        {
          id: '4',
          senderId: 'user2',
          receiverId: 'currentUser',
          content: 'Hello! How are you?',
          timestamp: new Date(Date.now() - 1000 * 60 * 2),
          read: false,
          type: 'text'
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg = {
      id: Date.now().toString(),
      senderId: 'currentUser',
      receiverId: selectedConversation,
      content: newMessage,
      timestamp: new Date(),
      read: false,
      type: 'text'
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // Update conversation last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation
          ? {
              ...conv,
              lastMessage: newMessage,
              lastMessageTime: new Date(),
              unreadCount: 0
            }
          : conv
      )
    );
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const formatMessageTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  // Navigation handlers
  const handleProfile = () => {
    // Navigate to profile page
    window.location.href = '/my-profile';
  };

  const handleDashboard = () => {
    // ✅ CHANGED: Navigate to profiles page (dashboard removed)
    // window.location.href = '/dashboard'; // ❌ OLD: Commented out - dashboard removed
    window.location.href = '/profiles'; // ✅ NEW: Navigate to profiles page
  };

  const handleMatches = () => {
    // Navigate to matches
    window.location.href = '/matches';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-800 to-red-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <button onClick={handleDashboard} className="hover:text-yellow-300 transition font-medium">
                    View All Profiles
                  </button>
                </li>
                <li>
                  <button onClick={handleMatches} className="hover:text-yellow-300 transition font-medium">
                    Matches
                  </button>
                </li>
                <li>
                  <button onClick={handleProfile} className="hover:text-yellow-300 transition font-medium">
                    My Profile
                  </button>
                </li>
                <li>
                  <span className="text-yellow-300 font-semibold border-b-2 border-yellow-300 pb-1">
                    Messages
                  </span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Messages</h1>
              <p className="text-gray-600">Connect with your matches</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-200">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="max-h-[600px] overflow-y-auto">
              {filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-6 border-b border-gray-200 cursor-pointer transition-colors ${
                    selectedConversation === conversation.id
                      ? 'bg-yellow-50 border-l-4 border-l-yellow-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar with Online Indicator */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-semibold">
                        {conversation.userName.charAt(0)}
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">{conversation.userName}</h3>
                        <span className="text-sm text-gray-500">
                          {getTimeAgo(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className={`text-gray-600 ${conversation.unreadCount > 0 ? 'font-semibold' : ''}`}>
                        {conversation.lastMessage}
                      </p>
                    </div>

                    {/* Unread Badge */}
                    {conversation.unreadCount > 0 && (
                      <div className="bg-red-500 w-3 h-3 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col">
            {selectedConversation && currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-semibold">
                        {currentConversation.userName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {currentConversation.userName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {currentConversation.isOnline 
                            ? 'Online now' 
                            : `Last seen ${getTimeAgo(currentConversation.lastSeen || new Date())}`
                          }
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                      <EllipsisHorizontalIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[500px]">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.senderId === 'currentUser'
                            ? 'bg-yellow-500 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className={`text-xs mt-1 flex items-center justify-end space-x-1 ${
                          message.senderId === 'currentUser' ? 'text-yellow-100' : 'text-gray-500'
                        }`}>
                          <span>{formatMessageTime(message.timestamp)}</span>
                          {message.senderId === 'currentUser' && (
                            <CheckIcon className={`w-3 h-3 ${
                              message.read ? 'text-blue-300' : 'text-yellow-100'
                            }`} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversation selected</h3>
                <p className="text-gray-600 max-w-sm">
                  Select a conversation from the list to start messaging your matches
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;