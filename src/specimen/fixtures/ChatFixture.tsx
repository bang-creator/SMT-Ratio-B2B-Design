import { Card, PageHeader } from '../../components/ds';
import { ChatPanel } from '../../components/chat/ChatPanel';

export function ChatFixture() {
  return <><PageHeader title="Chat fixture" description="Dark-first fidelity fixture for the Responses chat surface."/><Card><ChatPanel/></Card></>;
}
