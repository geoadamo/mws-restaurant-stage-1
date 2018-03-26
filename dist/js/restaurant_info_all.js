let restaurant,reviews;var map,marker;let review_form;function MapReady(){document.getElementById("restaurant-name").focus()}window.initMap=(()=>{self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),self.restaurant&&(self.map.setCenter(self.restaurant.latlng),self.marker||(self.marker=DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))),google.maps.event.addListenerOnce(self.map,"tilesloaded",MapReady)}),window.addEventListener("offline",e=>{toggleOffline(!0)}),window.addEventListener("online",e=>{toggleOffline(!1)}),toggleOffline=((e,t=!0)=>{e?document.getElementById("offline").style.visibility="visible":(document.getElementById("offline").style.visibility="hidden",t&&DBHelper.syncOfflineData())}),formSubmit=(e=>{e.preventDefault();let t=new FormData;for(let e of self.review_form)"submit"!=e.type&&("restaurant_id"==e.name?t.append(e.name,parseInt(e.value)):t.append(e.name,e.value));DBHelper.addReview(t).then(e=>{e&&(self.reviews=null,fetchRestaurantReviews((e,t)=>{if(e)console.error(e);else{const e=document.getElementById("reviews-list");e.innerHTML="";let r=1;t.forEach(t=>{e.appendChild(createReviewHTML(t,r)),r++}),document.getElementById("filtered-results").innerHTML="<p>Review added</p>",self.review_form.reset()}}))})}),document.addEventListener("DOMContentLoaded",e=>{toggleOffline(!navigator.onLine,!1),navigator.onLine?DBHelper.syncOfflineData().then(()=>{fetchRestaurantFromURL((e,t)=>{e?console.error(e):(fillBreadcrumb(),self.map&&(self.map.setCenter(self.restaurant.latlng),self.marker=DBHelper.mapMarkerForRestaurant(self.restaurant,self.map)),fetchRestaurantReviews((e,t)=>{e?console.error(e):fillReviewsHTML()}))})}):fetchRestaurantFromURL((e,t)=>{e?console.error(e):(fillBreadcrumb(),self.map&&(self.map.setCenter(self.restaurant.latlng),self.marker=DBHelper.mapMarkerForRestaurant(self.restaurant,self.map)),fetchRestaurantReviews((e,t)=>{e?console.error(e):fillReviewsHTML()}))}),self.review_form=document.getElementById("review-form"),self.review_form.addEventListener("submit",formSubmit)}),fetchRestaurantFromURL=(e=>{if(self.restaurant)return void e(null,self.restaurant);const t=getParameterByName("id");t?DBHelper.fetchRestaurantById(t,(t,r)=>{self.restaurant=r,r?(e(null,r),fillRestaurantHTML()):console.error(t)}):(error="No restaurant id in URL",e(error,null))}),fetchRestaurantReviews=(e=>{self.reviews?e(null,self.reviews):self.restaurant?DBHelper.fetchReviewsByRestaurantId(self.restaurant.id,(t,r)=>{self.reviews=r,r?e(null,r):console.error(t)}):console.error("Could not get reviews")}),fillRestaurantHTML=((e=self.restaurant)=>{const t=document.getElementById("restaurant-name");t.innerHTML=e.name,t.setAttribute("aria-label",`${e.name}, ${e.cuisine_type} cuisine`);const r=document.getElementById("restaurant-img");r.className="restaurant-img",r.alt=`${e.name} ${e.cuisine_type} Cuisine`,r.src=DBHelper.imageUrlForRestaurant(e);const a=document.getElementById("restaurant-address");a.innerHTML=e.address,a.setAttribute("aria-label",`address ${e.address}`),document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type;let n=document.getElementById("fav");e.is_favorite&&DBHelper.parseBoolean(e.is_favorite)&&(n.src="icons/favorite.png",n.setAttribute("data-is-favorite","true"),n.setAttribute("title","Click to mark as not favorite!"),n.setAttribute("aria-label","Press enter to mark as not favorite!")),n.addEventListener("click",e=>{toggleFavorite(e.target)}),n.addEventListener("keydown",e=>{13==e.keyCode&&toggleFavorite(e.target)}),document.getElementById("form_restaurant_id").value=self.restaurant.id,e.operating_hours&&fillRestaurantHoursHTML()}),toggleFavorite=(e=>{let t=self.restaurant.id,r=DBHelper.parseBoolean(e.getAttribute("data-is-favorite"));DBHelper.toggleFavorite(t,!r),1==!r?(e.src="icons/favorite.png",e.setAttribute("data-is-favorite","true"),e.setAttribute("title","Click to mark as not favorite!"),e.setAttribute("aria-label","Press enter to mark as not favorite!"),document.getElementById("filtered-results").innerHTML="<p>Υου marked as favorite</p>"):(e.src="icons/notfavorite.png",e.setAttribute("data-is-favorite","false"),e.setAttribute("title","Click to mark as favorite!"),e.setAttribute("aria-label","Press enter to mark as favorite!"),document.getElementById("filtered-results").innerHTML="<p>Υου marked as not favorite</p>")}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let r in e){const a=document.createElement("tr"),n=document.createElement("td");n.innerHTML=r,n.setAttribute("tabindex",0),n.setAttribute("aria-label",`${r} : ${e[r]}`),0,a.appendChild(n);const i=document.createElement("td");i.innerHTML=e[r],a.appendChild(i),t.appendChild(a)}}),fillReviewsHTML=((e=self.reviews)=>{const t=document.getElementById("reviews-container"),r=document.createElement("h3");if(r.innerHTML="Reviews",r.setAttribute("aria-label",`${e.length} reviews`),r.setAttribute("tabindex",0),t.appendChild(r),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const a=document.createElement("ul");a.setAttribute("id","reviews-list");let n=1;e.forEach(e=>{a.appendChild(createReviewHTML(e,n)),n++}),t.appendChild(a)}),createReviewHTML=((e,t)=>{const r=document.createElement("li");r.setAttribute("tabindex",0),r.setAttribute("aria-label",`Review ${t}`);const a=document.createElement("div");a.className="review-inner";const n=document.createElement("h4");n.className="review-reviewer",n.setAttribute("tabindex",0),n.setAttribute("aria-label",`reviewer name ${e.name} date ${e.date}`),n.innerHTML=e.name;const i=document.createElement("p");i.className="review-date",i.innerHTML=DBHelper.toDate(e.updatedAt);const l=document.createElement("table");l.setAttribute("width","100%");const s=document.createElement("tbody"),o=document.createElement("tr"),d=document.createElement("td"),m=document.createElement("td");d.setAttribute("align","left"),d.appendChild(n),m.setAttribute("align","right"),m.appendChild(i),o.appendChild(d),o.appendChild(m),s.appendChild(o),l.appendChild(s),r.appendChild(l);const u=document.createElement("p");u.className="review-rating",u.setAttribute("aria-label",`review rating ${e.rating}`),u.innerHTML=`Rating: ${e.rating}`,u.setAttribute("tabindex",0),a.appendChild(u);const c=document.createElement("p");return c.setAttribute("aria-label",`review, ${e.comments}`),c.innerHTML=e.comments,c.setAttribute("tabindex",0),a.appendChild(c),r.appendChild(a),r}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),r=document.createElement("li");r.innerHTML=e.name,t.appendChild(r)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const r=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return r?r[2]?decodeURIComponent(r[2].replace(/\+/g," ")):"":null});
class DBHelper{static get DATABASE_URL(){return"http://localhost:1337/restaurants/"}static get DATABASE_REVIEWS_URL(){return"http://localhost:1337/reviews/"}static openDB(){return idb.open("adamoDB",4,e=>{switch(e.oldVersion){case 0:e.createObjectStore("restaurants",{keyPath:"id"});case 1:e.createObjectStore("reviews",{keyPath:"id"}).createIndex("restaurant_id","restaurant_id",{unique:!1});case 2:e.createObjectStore("pending_favorite",{keyPath:"id",autoIncrement:!0});case 3:e.createObjectStore("pending_reviews",{keyPath:"id",autoIncrement:!0}).createIndex("restaurant_id","restaurant_id",{unique:!1})}})}static saveRestaurantsToDB(e){return"indexedDB"in window?DBHelper.openDB().then(t=>{const r=t.transaction("restaurants","readwrite"),n=r.objectStore("restaurants");return Promise.all(e.map(e=>n.put(e))).then(()=>e).catch(()=>{throw r.abort(),Error("Restaurants were not added to db")})}):null}static saveReviewsToDB(e){return"indexedDB"in window?DBHelper.openDB().then(t=>{const r=t.transaction("reviews","readwrite"),n=r.objectStore("reviews");return Promise.all(e.map(e=>n.put(e))).then(()=>e).catch(()=>{throw r.abort(),Error("Restaurants were not added to db")})}):null}static savePendingFavorite(e){return"indexedDB"in window?DBHelper.openDB().then(t=>{const r=t.transaction("pending_favorite","readwrite"),n=r.objectStore("pending_favorite");return Promise.all(e.map(e=>n.put(e))).then(()=>e).catch(e=>{throw r.abort(),Error("Favorites were not added to indexed db")})}):null}static savePendingReview(e){return"indexedDB"in window?DBHelper.openDB().then(t=>{const r=t.transaction("pending_reviews","readwrite"),n=r.objectStore("pending_reviews");return Promise.all(e.map(e=>n.put(e))).then(()=>e).catch(e=>{throw r.abort(),Error("Reviews were not added to indexed db")})}):null}static getLocalRestaurantsData(){return"indexedDB"in window?DBHelper.openDB().then(e=>e.transaction("restaurants").objectStore("restaurants").getAll()).then(e=>e):null}static getLocalRestaurantsDataById(e){return"indexedDB"in window?DBHelper.openDB().then(t=>t.transaction("restaurants").objectStore("restaurants").get(parseInt(e))).then(e=>e):null}static getLocalReviewsByRestaurantId(e){return"indexedDB"in window?DBHelper.openDB().then(t=>t.transaction("reviews").objectStore("reviews").index("restaurant_id").getAll(parseInt(e))).then(t=>DBHelper.openDB().then(t=>t.transaction("pending_reviews").objectStore("pending_reviews").index("restaurant_id").getAll(parseInt(e))).then(e=>[...t,...e])):null}static syncOfflineData(){return DBHelper.openDB().then(e=>e.transaction("pending_favorite").objectStore("pending_favorite").getAll()).then(e=>e.length?Promise.all(e.map(e=>DBHelper.sendFavoritesToServer(e))):null).then(e=>e?DBHelper.openDB().then(e=>{return e.transaction("pending_favorite","readwrite").objectStore("pending_favorite").clear()}):null).catch(e=>{throw tx.abort(),Error("Panding favorites were not sent to server")}).then(()=>DBHelper.openDB().then(e=>e.transaction("pending_reviews").objectStore("pending_reviews").getAll())).then(e=>e.length?Promise.all(e.map(e=>DBHelper.sendReviewToServer(e))):null).then(e=>e?DBHelper.openDB().then(e=>{return e.transaction("pending_reviews","readwrite").objectStore("pending_reviews").clear()}):null).catch(e=>{throw Error("Panding reviews were not sent to server")})}static fetchRestaurants(e){fetch(DBHelper.DATABASE_URL).then(e=>e.json()).then(e=>DBHelper.saveRestaurantsToDB(e)).then(t=>e(null,t)).catch(t=>{DBHelper.getLocalRestaurantsData().then(t=>e(null,t))})}static fetchRestaurantById(e,t){fetch(`${DBHelper.DATABASE_URL}${e}`).then(e=>e.json()).then(e=>t(null,e)).catch(r=>{DBHelper.getLocalRestaurantsDataById(e).then(e=>t(null,e))})}static toggleFavorite(e,t,r){fetch(`${DBHelper.DATABASE_URL}${e}/?is_favorite=${t}`,{method:"put"}).catch(()=>{DBHelper.savePendingFavorite([{restaurant_id:parseInt(e),is_favorite:`${t}`}])}).then(()=>DBHelper.getLocalRestaurantsDataById(e)).then(e=>{e.is_favorite=`${t}`,DBHelper.saveRestaurantsToDB([e])})}static sendFavoritesToServer(e){return fetch(`${DBHelper.DATABASE_URL}${e.restaurant_id}/?is_favorite=${e.is_favorite}`,{method:"put"})}static sendReviewToServer(e){e.createdAt&&delete e.createdAt,e.updatedAt&&delete e.updatedAt,e.id&&delete e.id;let t=new FormData;for(let[r,n]of Object.entries(e))t.append(r,n);return fetch(`${DBHelper.DATABASE_REVIEWS_URL}`,{method:"post",body:t})}static fetchReviewsByRestaurantId(e,t){fetch(`${DBHelper.DATABASE_REVIEWS_URL}?restaurant_id=${e}`).then(e=>e.json()).then(e=>{for(let t of e)t.restaurant_id=parseInt(t.restaurant_id);return DBHelper.saveReviewsToDB(e)}).then(e=>t(null,e)).catch(r=>{DBHelper.getLocalReviewsByRestaurantId(e).then(e=>t(null,e))})}static addReview(e){return fetch(`${DBHelper.DATABASE_REVIEWS_URL}`,{method:"post",body:e}).then(e=>e).catch(()=>{let t={};for(let[r,n]of e)t[r]=n;t.restaurant_id=parseInt(t.restaurant_id);const r=Date.now();return t.createdAt=r,t.updatedAt=r,DBHelper.savePendingReview([t])})}static fetchRestaurantByCuisine(e,t){DBHelper.fetchRestaurants((r,n)=>{if(r)t(r,null);else{const r=n.filter(t=>t.cuisine_type==e);t(null,r)}})}static fetchRestaurantByNeighborhood(e,t){DBHelper.fetchRestaurants((r,n)=>{if(r)t(r,null);else{const r=n.filter(t=>t.neighborhood==e);t(null,r)}})}static fetchRestaurantByCuisineAndNeighborhood(e,t,r){DBHelper.fetchRestaurants((n,a)=>{if(n)r(n,null);else{let n=a;const i=a.map((e,t)=>a[t].neighborhood),s=i.filter((e,t)=>i.indexOf(e)==t),o=a.map((e,t)=>a[t].cuisine_type),l=o.filter((e,t)=>o.indexOf(e)==t);"all"!=e&&(n=n.filter(t=>t.cuisine_type==e)),"all"!=t&&(n=n.filter(e=>e.neighborhood==t)),r(null,{restaurants:n,cuisines:l,neighborhoods:s})}})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e,t=!1){let r="noimage",n=".jpg";switch(navigator.userAgent.indexOf("Chrome")>-1&&(n=".webp"),e.photograph&&(r=e.photograph),t){case!1:return`img/${r}${n}`;case!0:return`img/small/${r}${n}`}}static toDate(e){return new Date(e).toDateString()}static parseBoolean(e){if("boolean"==typeof e)return e;switch(e.toLowerCase()){case"false":return!1;case"true":return!0}}static mapMarkerForRestaurant(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:DBHelper.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}}
"use strict";!function(){function e(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function t(t,n,o){var r,i=new Promise(function(i,u){e(r=t[n].apply(t,o)).then(i,u)});return i.request=r,i}function n(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,n,o,r){r.forEach(function(r){r in o.prototype&&(e.prototype[r]=function(){return t(this[n],r,arguments)})})}function r(e,t,n,o){o.forEach(function(o){o in n.prototype&&(e.prototype[o]=function(){return this[t][o].apply(this[t],arguments)})})}function i(e,n,o,r){r.forEach(function(r){r in o.prototype&&(e.prototype[r]=function(){return e=this[n],(o=t(e,r,arguments)).then(function(e){if(e)return new c(e,o.request)});var e,o})})}function u(e){this._index=e}function c(e,t){this._cursor=e,this._request=t}function s(e){this._store=e}function a(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function p(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new a(n)}function f(e){this._db=e}n(u,"_index",["name","keyPath","multiEntry","unique"]),o(u,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),i(u,"_index",IDBIndex,["openCursor","openKeyCursor"]),n(c,"_cursor",["direction","key","primaryKey","value"]),o(c,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(c.prototype[t]=function(){var n=this,o=arguments;return Promise.resolve().then(function(){return n._cursor[t].apply(n._cursor,o),e(n._request).then(function(e){if(e)return new c(e,n._request)})})})}),s.prototype.createIndex=function(){return new u(this._store.createIndex.apply(this._store,arguments))},s.prototype.index=function(){return new u(this._store.index.apply(this._store,arguments))},n(s,"_store",["name","keyPath","indexNames","autoIncrement"]),o(s,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),i(s,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),r(s,"_store",IDBObjectStore,["deleteIndex"]),a.prototype.objectStore=function(){return new s(this._tx.objectStore.apply(this._tx,arguments))},n(a,"_tx",["objectStoreNames","mode"]),r(a,"_tx",IDBTransaction,["abort"]),p.prototype.createObjectStore=function(){return new s(this._db.createObjectStore.apply(this._db,arguments))},n(p,"_db",["name","version","objectStoreNames"]),r(p,"_db",IDBDatabase,["deleteObjectStore","close"]),f.prototype.transaction=function(){return new a(this._db.transaction.apply(this._db,arguments))},n(f,"_db",["name","version","objectStoreNames"]),r(f,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[s,u].forEach(function(t){t.prototype[e.replace("open","iterate")]=function(){var t,n=(t=arguments,Array.prototype.slice.call(t)),o=n[n.length-1],r=this._store||this._index,i=r[e].apply(r,n.slice(0,-1));i.onsuccess=function(){o(i.result)}}})}),[u,s].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,o=[];return new Promise(function(r){n.iterateCursor(e,function(e){e?(o.push(e.value),void 0===t||o.length!=t?e.continue():r(o)):r(o)})})})});var d={open:function(e,n,o){var r=t(indexedDB,"open",[e,n]),i=r.request;return i.onupgradeneeded=function(e){o&&o(new p(i.result,e.oldVersion,i.transaction))},r.then(function(e){return new f(e)})},delete:function(e){return t(indexedDB,"deleteDatabase",[e])}};"undefined"!=typeof module?(module.exports=d,module.exports.default=module.exports):self.idb=d}();