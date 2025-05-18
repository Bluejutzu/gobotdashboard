import { useEffect } from 'react';
import { PostgrestRealtimePayload } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useRealtimeMessages(
  onMessageChange: (payload: PostgrestRealtimePayload<any>) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          onMessageChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onMessageChange]);
}
