class BulkTimeEntry
  def self.import_from_csv(file)
    csv_file = File.read(file)
    row_counter = 0
    failed_counter = 0

    begin
      ActiveRecord::Base.transaction do
        FasterCSV.parse(csv_file) do |row|
          if row[0].blank? ||
              row[2].blank? ||
              row[3].blank? ||
              row[4].blank? ||
              row[5].blank?
            
            failed_counter += 1
            next

          end
          @time = TimeEntry.new(:issue_id => row[0],
                               :spent_on => row[2],
                               :activity => TimeEntryActivity.find_by_name(row[3].strip),
                               :hours => row[4])
          # Truncate comments to 255 chars
          @time.comments = row[1].mb_chars[0..255].strip.to_s if row[1].present?
          @time.user = User.find_by_login(row[5].strip)

          @time.save!
          row_counter += 1
        end
      end
    rescue ActiveRecord::StatementInvalid, ActiveRecord::RecordNotSaved, ActiveRecord::RecordInvalid => ex
      return "ERROR: #{ex.message} on:\n\n#{@time.inspect}"
    end
    failed_message = failed_counter == 0 ? '' : "#{failed_counter} records failed to import."
    return "Imported #{row_counter} records. #{failed_message}"
  end

  def self.get_issues(project_id, options={})
    project = self.allowed_project?(project_id)
    if project
      query = []

      # options
      if options[:not_closed].present?
        query << "issue_statuses.is_closed is FALSE"
      end

      if options[:only_yours].present?
        query << "issues.assigned_to_id = "+User.current.id.to_s
      end

      project.issues.joins(:status).where(query.join(" AND ")).order('id ASC')
    else
      []
    end
  end

  def self.allowed_project?(project_id)
    return User.current.projects.where(Project.allowed_to_condition(User.current, :log_time)).
                                 where(id: project_id).first
  end
  
end
