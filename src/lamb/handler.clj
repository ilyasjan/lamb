(ns lamb.handler
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [clojure.java.io :as io]
            [ring.adapter.jetty :as jetty]
            [clojure.string :as str]
            [com.ebaxt.ring-rewrite :refer [rewrite-page wrap-rewrite]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]])
  (:use
   [ring.middleware.json :only [wrap-json-response wrap-json-body]]
   [ring.util.response :only [response file-response redirect content-type]]))



(def res-dir "/home/yusupjan/res/")
(def apache-url "http://61.128.123.107/res/")

(defn get-pl [pl]   (map (fn [x] {:src
                                  (conj [] (str apache-url pl "/" (.getName x)))
                                  :title (str  (apply str  (take 33  (.getName x)) ) "...")
                                  })(rest (-> (str  res-dir pl) io/file file-seq))))


(defn get-pls []
  (map #(.getName %)
       (filter #(not (empty? (.list %)))
               (rest (-> res-dir
                         clojure.java.io/file
                         .listFiles)))))

(defn contains-illegal? [s]
  (not
   (empty?
    (re-seq #"[\\.<>!\\?\+]" s))))

(defroutes app-routes
  (GET "/playlists" [] (fn [req]
                         (response (vec (get-pls)))))

  (GET "/playlists-demo" [] (fn [req]
                         (response (vec (range 10)))))

  (GET "/playlist-content" [] (fn [req]
                                (let [pl (get-in req [:params :pl])]
                                  (if (str/blank? pl)
                                    (response
                                     (get-pl "LinuxIntro"))
                                    (if (contains-illegal? pl)
                                      (response (get-pl "LinuxIntro"))
                                      (response (get-pl pl)))))))


  (GET "/" [] "Hello World")
  (route/resources "/")
  (route/not-found "Not Found"))

(def redirect-handler
  (fn [req]
    (wrap-rewrite req
                  [:rewrite "/" "/index.htm" :method :get]
                  )))

(def app
  (-> app-routes
      (wrap-json-body)
      (wrap-json-response)
      (redirect-handler)
      (wrap-defaults site-defaults)
      ))

(defn -main [& [port]]
  (jetty/run-jetty #'app
                   {:port 3000}))
