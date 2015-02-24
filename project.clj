(defproject lamb "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [compojure "1.3.1"]
                 [ring/ring-defaults "0.1.2"]
                 [ring "1.3.2" :exclusions [org.clojure/java.classpath]]
                 [ring-rewrite "0.1.0"]
                 [clj-pid "0.1.1"]
                 [ring/ring-json "0.3.1"]]
  :plugins [[lein-ring "0.8.13"]
            [cider/cider-nrepl "0.9.0-SNAPSHOT"]
            ]
  :ring {:handler lamb.handler/app}
  :profiles
  {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]
                        [ring-mock "0.1.5"]]}})
