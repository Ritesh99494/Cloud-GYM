import React from 'react';
import { Brain, Target, TrendingUp, MapPin, Star } from 'lucide-react';
import { AIRecommendation } from '../../types';

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
  onGymSelect: (gymId: string) => void;
  loading?: boolean;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  recommendations,
  onGymSelect,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
            <p className="text-sm text-gray-600">Analyzing your fitness goals...</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
            <p className="text-sm text-gray-600">No recommendations available</p>
          </div>
        </div>
        
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Update your fitness goals in your profile to get personalized gym recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          <p className="text-sm text-gray-600">Personalized for your fitness goals</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div
            key={recommendation.gym.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onGymSelect(recommendation.gym.id)}
          >
            <div className="flex items-start space-x-4">
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                }`}>
                  {index + 1}
                </div>
              </div>

              {/* Gym Image */}
              <div className="flex-shrink-0">
                <img
                  src={recommendation.gym.images[0] || 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg'}
                  alt={recommendation.gym.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </div>

              {/* Gym Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 truncate">
                    {recommendation.gym.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        {Math.round(recommendation.score * 100)}% match
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{recommendation.gym.distance?.toFixed(1)} km away</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{recommendation.gym.rating}</span>
                  </div>
                </div>

                {/* Matched Goals */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {recommendation.matchedGoals.map((goal, goalIndex) => (
                      <span
                        key={goalIndex}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        <Target className="h-3 w-3 mr-1" />
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reasons */}
                <div className="space-y-1">
                  {recommendation.reasons.slice(0, 2).map((reason, reasonIndex) => (
                    <div key={reasonIndex} className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <h5 className="font-medium text-purple-900 mb-1">How AI Recommendations Work</h5>
            <p className="text-sm text-purple-700">
              Our AI analyzes your fitness goals, workout history, location preferences, and gym amenities 
              to suggest the best matches for your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};