(ns lamb.handler
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [clojure.java.io :as io]
            [clojure.string :as str]
            [com.ebaxt.ring-rewrite :refer [rewrite-page wrap-rewrite]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]])
  (:use
        [ring.middleware.json :only [wrap-json-response]]
        [ring.util.response :only [response file-response redirect content-type]]
        ))


;;61.128.123.107/res

(defn get-pl [pl]   (map (fn [x] {:src
                                  (conj [] (str "http://61.128.123.107/res/" pl "/" (.getName x)))
                                  :title (str  (apply str  (take 33  (.getName x)) ) "...")
                                  })(rest (-> (str  "/home/yusupjan/res" pl) io/file file-seq))))


(defroutes app-routes
  (GET "/playlists" [] (fn [req]
                         ""))
  (GET "/playlist-content" [] (fn [req]
                                (let [pl (get-in req [:params :pl])]
                                  (if (str/blank? pl)
                                    (response
                                     (shuffle (get-pl "Pop2015")))
                                    (if (tricks/contains-illegal? pl)
                                      (response (shuffle (get-pl "Pop2015")))
                                      (response (shuffle (get-pl pl))))))))
  (GET "/" [] "Hello World")
  (route/not-found "Not Found"))

(def app
  (wrap-defaults app-routes site-defaults))
