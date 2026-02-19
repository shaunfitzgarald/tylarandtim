import { useState, useEffect } from 'react';
import { ContentService } from '../services/firestore';

export const useContent = (sectionId, defaultContent) => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const fetchContent = async () => {
      try {
        const data = await ContentService.getContent(sectionId);
        if (mounted && data) {
          setContent(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error(`Failed to fetch content for ${sectionId}`, err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchContent();

    return () => {
      mounted = false;
    };
  }, [sectionId]);

  return { content, loading };
};
