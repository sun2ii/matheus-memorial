import type { Dict } from '@/lib/i18n';
import VideoTributeClient from './VideoTributeClient';

export default function VideoTribute({ dict }: { dict: Dict }) {
  return <VideoTributeClient dict={dict} />;
}
