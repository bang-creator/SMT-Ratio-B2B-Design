import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Supplemental / Chat',
  parameters: { layout: 'padded' },
};

/* Source: Playground Chat experience on platform.openai.com/playground
 * Ground truth:
 * - Thread messages: user message (bubble secondary) + assistant message
 * - Composer: multiline input with action controls and 32px Send button */

export const Default = story(
  'Default / Supplemental / Chat / Default',
  stage(
    'Standard Chat Interface',
    `<div class="ds-chat ds-stack">
      <div class="ds-chat__messages ds-stack">
        <div class="ds-message ds-message--system">
          <span class="ds-muted">Model: gpt-4o • System instructions applied</span>
        </div>
        <div class="ds-message ds-message--user">
          <p>How do I configure structured JSON outputs in the Python SDK?</p>
        </div>
        <div class="ds-message ds-message--assistant">
          <p>You can use the <code>response_format</code> parameter with a Pydantic schema model:</p>
          <pre class="ds-code"><code>completion = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[...],
    response_format=CalendarEvent,
)</code></pre>
        </div>
      </div>
      <div class="ds-chat__composer ds-row">
        <textarea class="ds-textarea" placeholder="Send a message..." rows="2"></textarea>
        <button class="ds-button ds-button--primary" type="button">Send</button>
      </div>
    </div>`
  )
);

export const Streaming = story(
  'Default / Supplemental / Chat / Streaming',
  stage(
    'Streaming Token Output',
    `<div class="ds-chat ds-stack">
      <div class="ds-chat__messages ds-stack">
        <div class="ds-message ds-message--user">
          <p>Explain quantum superposition in simple terms.</p>
        </div>
        <div class="ds-message ds-message--assistant">
          <p>Quantum superposition means a particle can exist in multiple states at the same time until it is measured<span class="ds-status-dot ds-status-dot--positive"></span></p>
        </div>
      </div>
    </div>`
  )
);
