module BulkTimeEntriesHelper
  # Cheap knock off of the tabular form builder's labeling
  def label_for_field(field, rnd_id, options = { })
    label_text = l(options[:label]) if options[:label]
    label_text ||= l(("field_"+field.to_s.gsub(/\_id$/, "")).to_sym)
    span = options.delete(:required) ? content_tag(:span, " *", :class => "required") : ""
    label = content_tag(:label,
      :class => (@object && @object.errors[field] ? "error" : nil),
      :for => (@object_name.to_s + "_" + rnd_id.to_s + "_" + field.to_s)) do
      (label_text + span).html_safe
    end
    label
  end

  def grouped_options_for_issues(issues, selected = '')
    closed_issues, open_issues = *issues.partition {|issue| issue.closed?}

    html = content_tag :option
    unless open_issues.empty?
      html << labeled_option_group_from_collection_for_select(:label_open_issues, open_issues, selected)
    end

    unless closed_issues.empty?
      html << labeled_option_group_from_collection_for_select(:label_closed_issues, closed_issues)
    end
    html
  end

  def labeled_option_group_from_collection_for_select(label, collection, selected = '')
    html = content_tag(:optgroup, '', label: l(label))
    html << options_from_collection_for_select(collection, :id, :to_s, selected)
    html
  end
end
