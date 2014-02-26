module StatisticsHelper
  def count_all_europeana_items
    RunCoCo.configuration.search_engine == :solr ? EuropeanaRecord.count : EuropeanaController.new.count_all
  end
  
  def count_all_dpla_items
    controller = FederatedSearch::DplaController.new
    def controller.params
      { :count => 1 }
    end
    controller.count_all
  end
  
  def count_all_digitalnz_items
    controller = FederatedSearch::DigitalnzController.new
    def controller.params
      { :count => 1 }
    end
    controller.count_all
  end
  
  def count_all_trove_items
    controller = FederatedSearch::TroveController.new
    def controller.params
      { :count => 1, :qf => [ 'zone:article,book,collection,map,music,picture,newspaper' ] }
    end
    controller.count_all
  end
end
