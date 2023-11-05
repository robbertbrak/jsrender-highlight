import { html } from "@codemirror/lang-html";
import { jsrender } from "@codemirror/lang-jsrender";
import { basicSetup, EditorView } from "codemirror";
import React, { createRef } from "react";
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.ref = createRef();
  }


  render() {
    return (
      <div ref={this.ref}>
      </div>
    );
  }

  componentDidMount() {
    this.cm = new EditorView({
      doc: myDoc,
      extensions: [
        basicSetup,
        jsrender({ base: html() }),
      ],
    })

    this.ref.current.appendChild(this.cm.dom);

    // Uncomment to see proper highlighting of the entire document.
    // this.cm.dispatch({ changes: { from: 0, to: this.cm.state.doc.length, insert: myDoc } })
  }

  componentWillUnmount() {
    this.cm.destroy();
  }
}

export default App;

const myDoc = `<div>
  <h1>Workflow Summary for Approver</h1>

  <div class='row'>
    <label>Summary of workflow</label>
    <div class='value'>
      <span class='id'>{{:workflow.id}}</span>
      <span class='subject'>{{:workflow.subject}}</span>
    </div>
  </div>

  <div class='row'>
    <label>Generated for</label>
    <div class='value'>
      <span class='recipient'>{{:recipient.name}}</span>
      <span class='postfix'>{{:now}}</span>
    </div>
  </div>

  {{if workflow.requests.length || workflow.problems.length}}
  <section>
    <h2>Created For</h2>

    {{for workflow.requests}}
    {{unless grouping_key == 'group'}}
    <div class='with-divider'>
      <div class='row'>
        <label>Request <span class='id'>{{:id}}</span></label>
        <div class='value'><a href='{{:url}}'>{{:subject}}</a></div>
      </div>
      <div class='row'>
        <label>Requested for</label>
        <div class='value'>{{:requested_for.name}}</div>
      </div>
    </div>
    {{/unless}}
    {{/for}}

    {{for workflow.problems}}
    <div class='with-divider'>
      <div class='row'>
        <label>Problem <span class='id'>{{:id}}</span></label>
        <div class='value'>{{:subject}}</div>
      </div>
      <div class='row'>
        <label>Manager</label>
        <div class='value'>{{:manager.name}}</div>
      </div>
    </div>
    {{/for}}

  </section>
  {{/if}}

  {{!-- List the UI extension fields of each request linked to this Workflow --}}
  {{for workflow.requests}}
  {{if ui_extension}}
  <section>
    <h2>Request <span class='id'>{{:id}}</span><span class='with-hyphen'>{{:ui_extension.title}}</span></h2>

    {{for ui_extension.sections}}
    <section>
      <h3 class="ui-extension-section-header">{{:header}}</h3>
      {{for fields}}
      <div class='row'>
        <label>{{:label}}</label>
        <div class='value'>{{:value}}</div>
      </div>
      {{/for}}
    </section>
    {{/for}}

  </section>
  {{/if}}
  {{/for}}

  {{if workflow.ui_extension}}
  <section>
    <h2>{{:workflow.ui_extension.title}}</h2>

    {{for workflow.ui_extension.sections}}
    <section>
      <h3 class="ui-extension-section-header">{{:header}}</h3>
      {{for fields}}
      <div class='row'>
        <label>{{:label}}</label>
        <div class='value'>{{:value}}</div>
      </div>
      {{/for}}
    </section>
    {{/for}}

  </section>
  {{/if}}

  <section>
    <h2>Workflow Details</h2>

    <div class='row'>
      <label>Manager</label>
      <div class='value'>{{:workflow.manager.name}}</div>
    </div>

    <div class='row'>
      <label>Service</label>
      <div class='value'>{{:workflow.service.name onError='-'}}</div>
    </div>

    <div class='row'>
      <label>Service provider</label>
      <div class='value'>{{:workflow.service.provider.name onError='-'}}</div>
    </div>

    <div class='row'>
      <label>Justification</label>
      <div class='value'>{{:workflow.justification onError='-'}}</div>
    </div>
  </section>

  {{if workflow.notes.length}}
  <section>
    <h2>Notes</h2>
    <div class="without-label">
      {{for workflow.notes}}
      <div class='note'>
        <div class='note-header'>
          <div class='person'>{{:person.name}}</div>
          <div class='date'>{{:created_at}}</div>
        </div>
        {{:html}}

        {{if attachments.length}}
        <div class='attachments'>
          {{for attachments}}
          <div class='attachment'>
            <a href='{{:url}}'>{{:name}}</a>
          </div>
          {{/for}}
        </div>
        {{/if}}
      </div>
      {{/for}}
    </div>
  </section>
  {{/if}}

  <section>
    <h2>Implementation</h2>

    {{for workflow.tasks}}
    {{if status_key != 'completed' && status_key != 'canceled' && status_key != 'failed' && service_instances.length}}
    <div class='implementation-task with-divider'>
      <div class='row'>
        <label>Task <span class='id'>{{:id}}</span></label>
        <div class='value'>{{:subject}}</div>
      </div>
      <div class='row'>
        <label>Impact</label>
        <div class='value'>{{:impact}}</div>
      </div>

      {{unless impact_key == 'none'}}
      <div class='row'>
        <label>Planned start</label>
        <div class='value'>{{:from}}</div>
      </div>
      {{/unless}}

      <div class='row'>
        <label>Completion target</label>
        <div class='value'>{{:completion_target_at}}</div>
      </div>

      {{unless impact_key == 'none'}}
      <div class='row'>
        <label>Duration</label>
        <div class='value'>{{:running_time}}</div>
      </div>
      {{/unless}}
    </div>
    {{/if}}
    {{/for}}

    <section class='row' id='workflow_completion_target_at'>
      <label>Completion target</label>
      <div class='value'>{{:workflow.completion_target_at}}</div>
    </section>
  </section>
</div>
`;
