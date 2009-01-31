var TimeEntry = Class.create({
  initialize: function(container) {
     this.container = container;

     this.observeElements()

     this.setInitialValuesFromLastRecord()

     //focus the project pulldown by default
     this.getElement('select.project-select').focus()
  } ,

  observeElements: function() {
     //select an issue by number
     this.getElement("input.jump-to-issue").observe('keyup',function(event) {
        if(event.target.value) {
           this.selectIssue(event.target.value)
        }
     }.bind(this))

     //save the last selected project, update issues
     this.getElement('select.project-select').observe('change',function(event) {
        TimeEntry.lastValues.projectId = event.target.value
        this.updateIssues()
     }.bind(this))

     //save the last filter checkbox values, update issues
     this.getElement('input.only-my-issues-checkbox').observe('click',function(event) {
        TimeEntry.lastValues.onlyMyIssues = event.target.checked
        this.updateIssues()
     }.bind(this))

     this.getElement('input.no-closed-issues-checkbox').observe('click',function(event) {
        TimeEntry.lastValues.noClosedIssues = event.target.checked
        this.updateIssues()
     }.bind(this))

     //save the last date
     this.getElement('input.spent_on').observe('change',function(event) {
        TimeEntry.lastValues.lastSpentOnDate = event.target.value
     })

     //observe the save button
     this.getElement('button.save-button').observe('click',function() {

     })
  } ,

  bindIssueSelectorToLink: function() {
     var issueSelector = this.getElement('select.issue-select')

     if(issueSelector) {
        var issueLink = this.getElement('a.issue-link')

        issueSelector.observe('change',function() {
           if(issueSelector.value > 0) {
              issueLink.writeAttribute("href", "/issues/show/" + issueSelector.value)
              issueLink.writeAttribute("target", "_blank")
           }
           else {
              issueLink.writeAttribute("href", "")
              issueLink.writeAttribute("target", "")
           }
        }.bind(this))
     }
  } ,

  setInitialValuesFromLastRecord: function() {
     if(TimeEntry.lastValues.projectId) {
        this.getElement('select.project-select').value = TimeEntry.lastValues.projectId
     }

     this.getElement('input.only-my-issues-checkbox').checked = TimeEntry.lastValues.onlyMyIssues
     this.getElement('input.no-closed-issues-checkbox').checked = TimeEntry.lastValues.noClosedIssues
     this.getElement('input.spent_on').value = TimeEntry.lastValues.lastSpentOnDate

     this.updateIssues()
  } ,

  updateIssues: function() {
     var params = {
        project_id: $F(this.getElement('select.project-select')),
        entry_id: this.container.id
     }

     if(this.getElement('input.only-my-issues-checkbox').checked) {
        params.assigned_to_id = TimeEntry.defaultUserId
     }

     if(this.getElement('input.no-closed-issues-checkbox').checked) {
        params.only_open = true
     }

     new Ajax.Request(TimeEntry.loadIssuesUrl, {
        parameters: params,
        onComplete: function() {
           this.bindIssueSelectorToLink()
        }.bind(this)
     })
  } ,

  selectIssue: function(issueId) {
     var selector = this.container.down('select.issue-select')

     if(selector) {
        selector.value = issueId;
     }
  } ,

  getElement: function(cssClass) {
     return this.container.down(cssClass)
  }
})

TimeEntry.lastValues = {
  projectId: null,
  onlyMyIssues: false,
  noClosedIssues: false,
  lastSpentOnDate: null //this one is set from ruby
}