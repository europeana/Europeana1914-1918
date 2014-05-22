module AnnotationsHelper
  def annotatable_title(annotatable)
    case annotatable
    when Attachment
      attachment_title(annotatable)
    when EuropeanaRecord
      annotatable.title
    else
      'Unknown'
    end
  end
  
  def annotatable_path(annotatable)
    contribution_attachment_path(annotatable.contribution, annotatable)
  end
end
