import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, Copy, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { Prompt, toggleFavorite, recordPromptUsage } from '@/api/prompts';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

// Format dates for display
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never';
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

// Export type to be used elsewhere
export type PromptCardProps = Prompt;

const PromptCard: React.FC<PromptCardProps> = ({
  id,
  title,
  description,
  content,
  interfaces,
  domains,
  tags,
  type,
  status,
  use_count,
  version,
  updated_at,
  last_used_at,
  is_favorite,
}) => {
  const navigate = useNavigate();

  const handleCopyPrompt = async () => {
    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(content);
      
      // Record the usage
      await recordPromptUsage(id, version);
      
      toast.success('Prompt copied to clipboard');
    } catch (error) {
      console.error('Error copying prompt:', error);
      toast.error('Failed to copy prompt');
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavorite(id, !is_favorite);
      toast.success(is_favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const handleCardClick = () => {
    navigate(`/prompts/${id}`);
  };

  // Get the primary interface to display
  const primaryInterface = interfaces && interfaces.length > 0 ? interfaces[0] : 'OTHER';
  const primaryDomain = domains && domains.length > 0 ? domains[0] : 'GENERAL';

  // Format status for display
  const statusColors = {
    'DRAFT': 'bg-yellow-100 text-yellow-800',
    'ACTIVE': 'bg-green-100 text-green-800',
    'DEPRECATED': 'bg-red-100 text-red-800'
  };

  return (
    <Card 
      className="h-full flex flex-col card-hover cursor-pointer" 
      onClick={handleCardClick}
    >
      <CardContent className="flex-1 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2">
            <div className="bg-blue-100 p-2 rounded-md text-blue-700">
              <BookOpen className="h-5 w-5" />
            </div>
            {status && (
              <Badge variant="outline" className={statusColors[status]}>
                {status}
              </Badge>
            )}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={is_favorite ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-amber-500"}
                  onClick={handleToggleFavorite}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{is_favorite ? 'Remove from favorites' : 'Add to favorites'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{description}</p>
        <div className="flex gap-1.5 flex-wrap mb-4">
          {tags && tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-muted/50 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-5 py-3 border-t flex justify-between bg-muted/20">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Tag className="h-3.5 w-3.5" />
            <span>{primaryInterface}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDate(updated_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{use_count || 0} uses</span>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyPrompt();
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy prompt</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default PromptCard;
