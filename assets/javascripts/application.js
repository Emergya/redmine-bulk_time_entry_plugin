function getLastTimeEntryDate() {
  if ($('.spent_on').size() > 0) {
    return $('.spent_on')[($('.spent_on').length)-1].value;
  } else {
    return null;
  }
}

function changeIssuesForProject(entryId) {
  var $select = $('#time_entries_'+entryId+'_project_id');
  var url = $select.data('url');
  var projectId = $select.val();
  //this).closest('.not_closed').is(':checked'
  //$("#not_closed").is(':checked')
  $.ajax({
    complete: function(request){},
    data: 'project_id=' + projectId + '&entry_id=' + entryId + '&not_closed=' + $('#'+entryId+'_not_closed').is(':checked') + '&only_yours=' + $('#'+entryId+'_only_yours').is(':checked'),
    type: 'post',
    url: url
  });
}

function focusToLastProjectSelect() {
  $('#entries').find("[id$=project_id]").last().focus();
}

function setLinkParams() {
  focusToLastProjectSelect();

  $('#add-entry-link').on('click', function(event) {
    event.preventDefault();
    var project_id = $('#entries select[id*="_project_id"]').last().val();
    var issue_id = $('#entries select[id*="_issue_id"]').last().val();
    var hours = $('#entries input[id*="_hours"]').last().val();
    var activity_id = $('#entries select[id*="_activity_id"]').last().val();

    var mData = 'date=' + getLastTimeEntryDate()
      + '&issue_id=' + issue_id
      + '&hours=' + hours
      + '&activity_id=' + activity_id
      + '&project_id=' + project_id;

    var url = $(event.target).attr('href');

    $.ajax({
      complete: function(request){},
      data: mData,
      type: 'put',
      url: url
    });
  });
}

$(document).ready(setLinkParams);
