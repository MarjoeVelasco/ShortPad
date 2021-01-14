var myApp = angular.module('myApp', ["ngRoute"]);
var sessionusername;
var loginstatus;
//***********************************ROUTES**********************************************************
myApp.config(function($routeProvider){
    $routeProvider

    .when("/login",{
        
        templateUrl:"pages/login.html",
        controller:"LoginCtrl"
    })

    .when("/",{
    templateUrl:"pages/home.html",
    controller:"homeCtrl"
    })

    .when("/home",{
        templateUrl:"pages/home.html",
        controller:"homeCtrl"
        })

    .when("/discover",{
    templateUrl:"pages/discover.html",
    controller:"discoverCtrl"
    })

    .when("/profile",{
        templateUrl:"pages/profile.html",
        controller:"profileCtrl"
    })
    
    .when("/search",{
        templateUrl:"pages/search.html",
        controller:"searchCtrl"
    })

    .when("/stories",{
        templateUrl:"pages/stories.html",
        controller:"storiesCtrl"
    })

    .when("/favorite",{
        templateUrl:"pages/favorite.html",
        controller:"favoriteCtrl"
    })

    .when("/read/:story_id",{
        templateUrl:"pages/read.html",
        controller:"readCtrl"
    })
    .otherwise({
    template:"<h2>Not Found</h2>"
    })
    
    })

//**********************************NAV CONTROLLER****************************************************   
myApp.controller('navCtrl', ['$scope','$window','$routeParams', '$http', function($scope,$window,$routeParams,$http) {
    console.log("Hello World from controller");

$http.get('/checksession').then(function(response) {
    console.log("I got the data I requested");
    $scope.status = response.data;
    console.log($scope.status.loginstatus);
    console.log($scope.status.username);
    if($scope.status.loginstatus==1)
    {
    $scope.username123=$scope.status.username;
    document.getElementById("logout2_button").style.display="block";
    document.getElementById("login2_button").style.display="none";
    }
    else
    {
    $scope.username123="Guest";         
    document.getElementById("login2_button").style.display="block";
    document.getElementById("logout2_button").style.display="none";
    }

  })

}]);



//**********************************read CONTROLLER****************************************************   
myApp.controller('readCtrl', ['$scope','$window','$routeParams','$route', '$http', function($scope,$window,$routeParams,$route,$http) {
    console.log("Hello World from controller");

     $scope.id = $routeParams.story_id;
    console.log($scope.id);
var username="";
var user="";
$http.get('/checksession').then(function(response) {
    console.log("I got the data I requested");
    $scope.status = response.data;
    console.log($scope.status.loginstatus);
    console.log($scope.status.username);
    if($scope.status.loginstatus==1)
    {
    $scope.username=$scope.status.username;
    user=$scope.status.username;
    $scope.user_id=$scope.status.user_id;//this
    console.log($scope.username);
    $scope.title=$scope.status.username;
    $scope.username123=$scope.status.username;
    
    console.log($scope.title);

    $http.get('/showprofile/'+$scope.username).then(function(response) {
        console.log("I got the data I requested");
        $scope.read2 = response.data;
        console.log($scope.read2);
        console.log("hello");
        $scope.id123=$scope.read2[0]._id;
    });
    

    }
    else
    {
    $scope.username="Guest";         
    $scope.username123="Guest";
    document.getElementById("comment_box").style.display="none";

    }

  })

  $http.get('/viewbook/'+$scope.id).then(function(response) {
    console.log("I got the data I requested");
    $scope.read = response.data;
    console.log($scope.read);
  })

  $scope.comment123=function(user123,content2)
  {
      console.log(user123);
      console.log(content2);

      $http.get('/showprofile/'+user123).then(function(response) {
        console.log("I got the data I requested");
        $scope.read3 = response.data;
        console.log($scope.read3);
        $scope.name=$scope.read3[0].name;
        $scope.userid=$scope.read3[0]._id;

        $http.put('/addComment/'+user123+'/'+$scope.name+'/'+$scope.userid+'/'+content2+'/'+$scope.id).then(function(response) {
            console.log("I got the data I requested");
            $scope.read3 = response.data;
            console.log($scope.read3);
      
            $http.get('/viewbook/'+$scope.id).then(function(response) {
                console.log("I got the data I requested");
                $scope.read = response.data;
                console.log($scope.read);
              })

        })


      })
      document.getElementById("comment_box").reset();
  }
 
$scope.deleteComment=function(story_id,comment_id)
{
    $http.delete('/removeComment/'+story_id+'/'+comment_id).then(function(response) {
        console.log("I got the data I requested");
        $scope.users = response.data;
        console.log($scope.users);

      })     

    $http.get('/viewbook/'+story_id).then(function(response) {
            console.log("I got the data I requested");
            $scope.read = response.data;
            console.log($scope.read);
          })   

}
var id1="";
var id2="";
$scope.editComment=function(story_id,comment_id,c_content)
{
$scope.new_cc_comment=c_content;
id1=story_id;
id2=comment_id;
}

$scope.upComment=function(new_comment)
{
console.log(new_comment);
console.log(id1);
console.log(id2);

$http.put('/editComment/'+id1+'/'+id2+'/'+new_comment).then(function(response) {
    console.log("I got the data I requested");
    $scope.read5 = response.data;
    console.log($scope.read5);
    })   

    $http.get('/viewbook/'+id1).then(function(response) {
        console.log("I got the data I requested");
        $scope.read = response.data;
        console.log($scope.read);
      })   

}
$scope.login=function(item)
    {
    
    if(item.password==item.password2)
    {
    
        console.log(item);
        $http.post('/login', item).then(function(response) {
          console.log(response.data);
          $scope.result = response.data;
          console.log($scope.result.message);
          console.log(item.User_UserName);
        if($scope.result.message=="Authenticated")
        {
            $("#login").modal("hide"); 
            $scope.title=item.User_UserName;    
            $scope.username123=item.User_UserName;
            $window.location.reload();
        }
        else
        {
        alert("Invalid Username or Password");  
        }
    
        })    
    }
    else
    {
    $scope.match="Passwords do not match"
    }
    
}    



$scope.register=function(item)
{
    console.log(item.password2);
    console.log(item.username);
    if(item.password!=item.password2)
    {
        $scope.match="Password does not match"
    }
    else
    {
        $http.get('/showprofile/'+item.username).then(function(response) {
            console.log("I got the data I requested");
            $scope.users = response.data;
            console.log($scope.users.length);
            if($scope.users.length==0)
            {
                $http.post('/register', item).then(function(response) {
                    console.log(response.data);
                    $scope.result = response.data;
                    console.log($scope.result.message);
                  if($scope.result.message=="Registered")
                  {
                  document.getElementById("register_form").reset();    
                  $scope.match="Successfully Registered"
                  alert("Successfully Registered");      
                  }
                  else
                  {
                  alert($scope.result.message);  
                  }
              
                  })    
            }
            else
            {
                $scope.match="Username Already Exists"
            }
        })
            
    }
    
}
    $scope.Stars = 0;
    $scope.maxStars = 5; 
    $scope.rate=5;
    $scope.getStarArray = function() {
      var result = [];
      for (var i = 1; i <= $scope.maxStars; i++)
        result.push(i);
      return result;
    };
    $scope.getClass = function(index) {
      return 'glyphicon glyphicon-star' + ($scope.Stars >= index ? '' : '-empty');
    };
    $scope.setClass = function(index) {
      $scope.Stars = index;
    };
$scope.rate=function(user,item,rate){
    console.log("hey"+user);
    if(user==null)
    {
        $("#view_book").modal("hide");
        $("#login").modal("show");   
    }
    else
    {
        $("#view_book").modal("show");
        console.log(user);
        console.log(item._id);
        console.log(item.title);
        console.log("bituisn"+rate)
        $http.post('/addRating/'+user+'/'+rate, item).then(function(response) {
            console.log(response.data);
            $("#view_book").modal("hide");
            alert("Story Rated");
            $route.reload();
        })
    }
}
  $http.get('/viewbook/'+$scope.id).then(function(response) {
    console.log("I got the data I requested");
    $scope.read = response.data;
    console.log($scope.read);
  })
$scope.edit_rate=function(user,item,rate){
    console.log("hey"+user);
    if(user==null)
    {
        $("#view_book").modal("hide");
        $("#login").modal("show");   
    }
    else
    {
        $("#view_book").modal("show");
        console.log(user);
        console.log(item._id);
        console.log(item.title);
        console.log("bituisn"+rate)
        $http.put('/editRating/'+user+'/'+rate, item).then(function(response) {
            console.log(response.data);
            $("#view_book").modal("hide");
            alert("Story Rating Updated");
            $route.reload();
        })
    }
}
}]);



//**********************************HOME CONTROLLER****************************************************   
myApp.controller('homeCtrl', ['$scope','$window', '$http', function($scope,$window,$http) {
    console.log("Hello World from controller");



$http.get('/checksession').then(function(response) {
    console.log("I got the data I requested");
    $scope.status = response.data;
    console.log($scope.status.loginstatus);
    console.log($scope.status.username);
    if($scope.status.loginstatus==1)
    {
    $scope.username=$scope.status.username;
    $scope.username123=$scope.status.username;
    }
    else
    {
    $scope.username123="Guest";
         
    }

  })

    $http.get('/viewbook/'+$scope.id).then(function(response) {
    console.log("I got the data I requested");
    $scope.read = response.data;
    console.log($scope.read);
  })  


$http.get('/showbookss').then(function(response) {
    console.log("I got the data I requested");
    $scope.books = response.data;
    console.log($scope.books);
  })
$scope.view=function(id)
{
    console.log(id);
    $http.get('/viewbook/'+id).then(function(response) { 
        console.log("I got the data I requested");
        $scope.viewbooks = response.data;
        console.log($scope.viewbooks);
      })
}

$scope.read=function(id,title)
{
    $("#view_book").modal("hide");
    $window.location.href="#!read/"+id;
}

}]);
//**********************************DISCOVER CONTROLLER****************************************************   
myApp.controller('discoverCtrl', ['$scope','$window', '$http', function($scope,$window,$http) {
    console.log("Hello World from controller");

$http.get('/checksession').then(function(response) {
    console.log("I got the data I requested");
    $scope.status = response.data;
    console.log($scope.status.loginstatus);
    console.log($scope.status.username);
    if($scope.status.loginstatus==1)
    {
    $scope.title=$scope.status.username;
    $scope.username=$scope.status.username;
    $scope.username123=$scope.status.username;
    console.log($scope.status.username);
    }
    else
    {
    $scope.username="Guest"    
    $scope.title="Guest";
    $scope.username123="Guest";

    }

  })

$scope.hello="whats up"

$http.get('/showbooks').then(function(response) {
    console.log("I got the data I requested");
    $scope.books = response.data;
    console.log($scope.books);
  })

$scope.view=function(id)
{
    console.log(id);
    $http.get('/viewbook/'+id).then(function(response) { 
        console.log("I got the data I requested");
        $scope.viewbooks = response.data;
        console.log($scope.viewbooks);
      })
}

$scope.favorite=function(user,item){
    console.log(user);
    if(user=="Guest")
    {
        $("#view_book").modal("hide");
        $("#login").modal("show");   
    }
    else
    {
        $("#view_book").modal("show");
        console.log(user);
        console.log(item._id);
        console.log(item.title);
        $http.put('/addToFav/'+user, item).then(function(response) {
            console.log(response.data);
            $("#view_book").modal("hide");
            alert("Story Added");
        })
    }

$scope.login=function(item)
    {
    
    if(item.password==item.password2)
    {
    
        console.log(item);
        $http.post('/login', item).then(function(response) {
          console.log(response.data);
          $scope.result = response.data;
          console.log($scope.result.message);
          console.log(item.User_UserName);
        if($scope.result.message=="Authenticated")
        {
            $("#login").modal("hide"); 
            $scope.title=item.User_UserName;    
            $scope.username123=item.User_UserName;
            $window.location.reload();
        }
        else
        {
        alert("Invalid Username or Password");  
        }
    
        })    
    }
    else
    {
    $scope.match="Passwords do not match"
    }
    
}    

}

$scope.register=function(item)
{
    console.log(item.password2);
    console.log(item.username);
    if(item.password!=item.password2)
    {
        $scope.match="Password does not match"
    }
    else
    {
        $http.get('/showprofile/'+item.username).then(function(response) {
            console.log("I got the data I requested");
            $scope.users = response.data;
            console.log($scope.users.length);
            if($scope.users.length==0)
            {
                $http.post('/register', item).then(function(response) {
                    console.log(response.data);
                    $scope.result = response.data;
                    console.log($scope.result.message);
                  if($scope.result.message=="Registered")
                  {
                  document.getElementById("register_form").reset();    
                  $scope.match="Successfully Registered"
                  alert("Successfully Registered");      
                  }
                  else
                  {
                  alert($scope.result.message);  
                  }
              
                  })    
            }
            else
            {
                $scope.match="Username Already Exists"
            }
        })
            
    }
    
}



$scope.read=function(id,title)
{
    $("#view_book").modal("hide");
    $window.location.href="#!read/"+id;
}

}]);

//***************************************SEARCH CONTROLLER*******************************************************
myApp.controller('searchCtrl', ['$scope','$window', '$http', function($scope,$window,$http) {
    console.log("Hello World from controller");



$http.get('/checksession').then(function(response) {
    console.log("I got the data I requested");
    $scope.status = response.data;
    console.log($scope.status.loginstatus);
    console.log($scope.status.username);
    if($scope.status.loginstatus==1)
    {
    $scope.username=$scope.status.username;
    $scope.username123=$scope.status.username;

    }
    else
    {
    $scope.username="Hello Guest";
    $scope.username123="Guest";

    }

  })

$scope.hello="whats up"

}]);
//***************************************STORIES CONTROLLER*******************************************************
myApp.controller('storiesCtrl', ['$scope','$window', '$http', function($scope,$window,$http) {
    console.log("Hello World from controller");

var user="";
var author_name="";
var id="";

var refresh=function(){
    $http.get('/showprofile/'+user).then(function(response) {
        console.log("I got the data I requested");
        $scope.users = response.data;
        name=$scope.users[0].name;
        id=$scope.users[0]._id;
        console.log(name);
        console.log(id);
    $http.get('/showOwnStoryUnpublished/'+id).then(function(response) {
        console.log("I got the data I requested");
        $scope.story = response.data;
        console.log($scope.story);
    });

    $http.get('/showOwnStoryPublished/'+id).then(function(response) {
        console.log("I got the data I requested");
        $scope.story2 = response.data;
        console.log($scope.story2);
    });
});
}

$http.get('/checksession').then(function(response) {
    console.log("I got the data I requested");
    $scope.status = response.data;
    console.log($scope.status.loginstatus);
    console.log($scope.status.username);
    if($scope.status.loginstatus==1)
    {
    $scope.title=$scope.status.username;
    user=$scope.status.username;
    $scope.username123=$scope.status.username;
    $scope.username=$scope.status.username;
    $scope.search=$scope.status.username+"'s Stories";
    document.getElementById("addStoryBtn").style.display="block";
    document.getElementById("PublishBtn").style.display="block";
    document.getElementById("UnPublishBtn").style.display="block";
    
    }
    else
    {
    document.getElementById("addStoryBtn").style.display="none"; 
    document.getElementById("PublishBtn").style.display="none";
    document.getElementById("UnPublishBtn").style.display="none";      
    $scope.title="Guest";
    $scope.username="Guest";
    $scope.username123="Guest";
    $scope.search="Please Log in to continue";

    }

  })

$scope.hello="whats up"
$scope.tempPhoto="";
$scope.showAddStory=function(){
document.getElementById("form_addStory").style.display="block";  
document.getElementById("unpublished").style.display="none";  
document.getElementById("published").style.display="none";   
}

$scope.showUnpublish=function(){
document.getElementById("unpublished").style.display="block";   
document.getElementById("form_addStory").style.display="none"; 
document.getElementById("published").style.display="none"; 
refresh();  
}

$scope.showPublish=function(){
    document.getElementById("published").style.display="block"; 
    document.getElementById("unpublished").style.display="none";
    document.getElementById("form_addStory").style.display="none";    
    refresh();        
}
    
$scope.addStory=function()
{
    $http.get('/showprofile/'+user).then(function(response) {
        console.log("I got the data I requested");
        $scope.users = response.data;
        name=$scope.users[0].name;
        id=$scope.users[0]._id;
        console.log(name);
        console.log(id);
        
    var form = document.getElementById('form-id');
    var formData = new FormData(form);
    
        var xhr = new XMLHttpRequest();
        destination = "/AddStory/"+id+"/"+name;
    
        xhr.onreadystatechange=function(){
            if (xhr.readyState == 4 && xhr.status == 200) {
                document.getElementById('form-id').reset();
               
            }
        }
        xhr.open("POST", destination, true);
        xhr.send(formData);
    })
}


$scope.login=function(item)
    {
    
    if(item.password==item.password2)
    {
    
        console.log(item);
        $http.post('/login', item).then(function(response) {
          console.log(response.data);
          $scope.result = response.data;
          console.log($scope.result.message);
          console.log(item.User_UserName);
        if($scope.result.message=="Authenticated")
        {
            $("#login").modal("hide"); 
            $scope.title=item.User_UserName;
            $scope.username123=item.User_UserName;
            $window.location.reload();  
        }
        else
        {
        alert("Invalid Username or Password");  
        }
    
        })    
    }
    else
    {
    $scope.match="Passwords do not match"
    }
    
}

$scope.register=function(item)
{
    console.log(item.password2);
    console.log(item.username);
    if(item.password!=item.password2)
    {
        $scope.match="Password does not match"
    }
    else
    {
        $http.get('/showprofile/'+item.username).then(function(response) {
            console.log("I got the data I requested");
            $scope.users = response.data;
            console.log($scope.users.length);
            if($scope.users.length==0)
            {
                $http.post('/register', item).then(function(response) {
                    console.log(response.data);
                    $scope.result = response.data;
                    console.log($scope.result.message);
                  if($scope.result.message=="Registered")
                  {
                  document.getElementById("register_form").reset();    
                  $scope.match="Successfully Registered"
                  alert("Successfully Registered");      
                  }
                  else
                  {
                  alert($scope.result.message);  
                  }
              
                  })    
            }
            else
            {
                $scope.match="Username Already Exists"
            }
        })
            
    }
    
}


$scope.publish=function(id)
{
    $http.put('/publish/'+id).then(function(response) {
        console.log(response.data);
        $scope.result = response.data;
        console.log($scope.result.message);
        alert("Story Published");
        refresh();
    });   
}

$scope.unpublish=function(id)
{
    $http.put('/unpublish/'+id).then(function(response) {
        console.log(response.data);
        $scope.result = response.data;
        console.log($scope.result.message);
        alert("Story Unpublished");
        refresh();
    });   
}

$scope.delete=function(id)
{
    $http.delete('/delete/'+id).then(function(response) {
        console.log(response.data);
        $scope.result = response.data;
        console.log($scope.result.message);
        alert("Story Deleted");
        refresh();
    });
}
$scope.delete2=function(id)
{
    $http.delete('/delete2/'+id).then(function(response) {
        console.log(response.data);
        $scope.result = response.data;
        console.log($scope.result.message);
        alert("Story Deleted");
        refresh();
    });
}
var story_id="";
$scope.edit=function(id)
{

    $http.get('/showOwnStoryEdit/'+id).then(function(response) {
        console.log(response.data);
        $scope.result2 = response.data;  
        $scope.update={type:$scope.result2[0].type,
                       genre:$scope.result2[0].genre,
                       title:$scope.result2[0].title,
                       description:$scope.result2[0].description,
                       content:$scope.result2[0].content,
        };
        story_id=$scope.result2[0]._id;
      
        
    });    
    document.getElementById("updateStory_form").style.display="block";    
}
var story_id2="";
$scope.changePhoto=function(id)
{
    document.getElementById("changeCover").style.display="block";
    story_id2=id;
    
}

$scope.changePic=function()
{
    console.log(story_id2);
    var form = document.getElementById('form123');
    var formData = new FormData(form);
    

    var xhr = new XMLHttpRequest();
    destination = "/changePhoto/"+story_id2;

    xhr.onreadystatechange=function(){
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(this.responseText);
            document.getElementById("changeCover").style.display="none";
        refresh();
        }
    }
    xhr.open("PUT", destination, true);
    xhr.send(formData);
}
  
$scope.updateStory=function(item)
{
    $http.put('/ownStoryUpdate/'+story_id,item).then(function(response) {
        console.log(response.data);
        $scope.result = response.data;  
        alert("Story Updated");
        refresh();
        document.getElementById("updateStory_form").style.display="none";
    });   
}    



$scope.view1=function(id)
{
    $window.location.href="#!read/"+id;
}

$scope.view2=function(id)
{
    $window.location.href="#!read/"+id;
}

}]);
//***********************************FAVORITE CONTROLLER*********************************************************
myApp.controller('favoriteCtrl', ['$scope','$window', '$http', function($scope,$window,$http) {
    console.log("Hello World from controller");

var user="";
var refresh=  function(){
    $http.get('/viewfave/'+user).then(function(response) {
        console.log("I got the data I requested");
        $scope.users = response.data;
        console.log($scope.users);
      })
    }      
$http.get('/checksession').then(function(response) {
    console.log("I got the data I requested");
    $scope.status = response.data;
    console.log($scope.status.loginstatus);
    console.log($scope.status.username);
    if($scope.status.loginstatus==1)
    {
    $scope.hello="whats up"    
    $scope.title=$scope.status.username;
    user=$scope.status.username;
    $scope.username123=$scope.status.username;
    $scope.username=$scope.status.username;
    $scope.display_username=user;
    console.log(user);
    refresh()


    }
    else
    {
        $scope.title="Guest";
        $scope.username123="Guest";
        $scope.hello="Please Log in to continue"
    }

})

$scope.view=function(id)
{
    console.log(id);
    $http.get('/viewbook/'+id).then(function(response) { 
        console.log("I got the data I requested");
        $scope.viewbooks = response.data;
        console.log($scope.viewbooks);
      })
}

$scope.removeFav=function(id)
{
    console.log(id);
        console.log(user);
    $http.delete('/removeFav/'+id+'/'+user).then(function(response) {
        console.log("I got the data I requested");
        $scope.users = response.data;
        console.log($scope.users);
       
      })   
      refresh();
    }

console.log($scope.user);

$scope.read=function(id)
{
    $("#view_book").modal("hide");
    $window.location.href="#!read/"+id;
}

}]);


//***********************************PROFILE CONTROLLER*************************************************
myApp.controller('profileCtrl', ['$scope','$window', '$http', function($scope,$window,$http) {
    console.log("Hello World from controller");

var user="";
var pass="";
var id="";
var match1="";
var match2="";

var refresh = function() {
    $http.get('/showprofile/'+user).then(function(response) {
            console.log("I got the data I requested");
            $scope.users = response.data;
            id=$scope.users[0]._id;
            pass=$scope.users[0].password;
            $scope.display_name=$scope.users[0].name;
          })
}

$http.get('/checksession').then(function(response) {
    console.log("I got the data I requested");
    $scope.status = response.data;
    console.log($scope.status.loginstatus);
    console.log($scope.status.username);
    

    if($scope.status.loginstatus==1)
    {
    $scope.username=$scope.status.username;
    user=$scope.status.username;
    $scope.display_username=user;
    $scope.username123=user;
    console.log(user);
    document.getElementById("content_profile").style.display="block";
    document.getElementById("login_button").style.display="none";
    }
    else
    {
        $scope.username="Guest!";
        $scope.username123="Guest";
        document.getElementById("content_profile").style.display="none";
        $('#login').modal('show');
    }

refresh()    
})

$scope.changePass = function(item) {
if(item.password!=item.password2||item.oldPass!=pass){    
if(item.oldPass!=pass)
{
match1="Incorrect Password ";    
}
else if(item.oldPass==pass)
{
match1="";    
}
if(item.password!=item.password2)
{
match2="Passwords does not match";    
}
else if(item.password==item.password2)
{
match2="";    
}
}
else if(item.password==item.password2&&item.oldPass==pass)
{
match1="Changes Saved";  
match2="";
$http.put('/changePassword/'+id,item).then(function(response) {
    console.log(response.data);
    refresh()
  });
}
$scope.match=match1+match2;
}

$scope.changeName=function(item){
$http.put('/changeName/'+id,item).then(function(response) {
        console.log(response.data);
        refresh()   
        $scope.match_name="Changes Saved";
});      
}

$scope.changeUsername=function(user){

    $http.get('/showprofile/'+user).then(function(response) {
        console.log("I got the data I requested");
        $scope.users = response.data;
        console.log($scope.users.length);
        if($scope.users.length==0)
        {
            
        $http.put('/changeUsername/'+id+'/'+user).then(function(response) {
        console.log(response.data);
        $window.location.href="http://localhost:8080/logout";    

        });
        }
        else
        {
        $scope.match_username="Username already exists";  
        refresh()  
        }
      });
}

$scope.login=function(item)
    {
    
    if(item.password==item.password2)
    {
    
        console.log(item);
        $http.post('/login', item).then(function(response) {
          console.log(response.data);
          $scope.result = response.data;
          console.log($scope.result.message);
          console.log(item.User_UserName);
          user=item.User_UserName;
        if($scope.result.message=="Authenticated")
        {
            $("#login").modal("hide"); 
            $http.get('/showprofile/'+user).then(function(response) {
                console.log("I got the data I requested");
                $scope.users = response.data;
                id=$scope.users[0]._id;
                pass=$scope.users[0].password;
                $scope.display_name=$scope.users[0].name;
                $window.location.reload();
              })

            $scope.username=item.User_UserName;
            document.getElementById("content_profile").style.display="block";
            document.getElementById("login_button").style.display="none";
    
        }
        else
        {
        alert("Invalid Username or Password");  
        }
    
        })    
    }
    else
    {
    $scope.match="Passwords do not match"
    }
    
}

$scope.register=function(item)
{
    console.log(item.password2);
    console.log(item.username);
    if(item.password!=item.password2)
    {
        $scope.match="Password does not match"
    }
    else
    {
        $http.get('/showprofile/'+item.username).then(function(response) {
            console.log("I got the data I requested");
            $scope.users = response.data;
            console.log($scope.users.length);
            if($scope.users.length==0)
            {
                $http.post('/register', item).then(function(response) {
                    console.log(response.data);
                    $scope.result = response.data;
                    console.log($scope.result.message);
                  if($scope.result.message=="Registered")
                  {
                  document.getElementById("register_form").reset();    
                  $scope.match="Successfully Registered"
                  alert("Successfully Registered");      
                  }
                  else
                  {
                  alert($scope.result.message);  
                  }
              
                  })    
            }
            else
            {
                $scope.match="Username Already Exists"
            }
        })
            
    }
    
}




}]);

//*********************************LOG IN CONTROLLER************************************************ 

myApp.controller('LoginCtrl', ['$scope','$window', '$http', function($scope,$window,$http) {
    console.log("Hello World from controller");

$scope.hello="Log In";

$scope.login=function(item)
{

if(item.password==item.password2)
{

    console.log(item);
    $http.post('/login', item).then(function(response) {
      console.log(response.data);
      $scope.result = response.data;
      console.log($scope.result.message);
    if($scope.result.message=="Authenticated")
    {
document.getElementById("login_form").reset();     
$window.location.href="#!";
$window.location.reload();
  
alert("Welcome!");  
    }
    else
    {
    alert("Invalid Username or Password");  
    }

    })    
}
else
{
$scope.match="Passwords do not match"
}

}

$scope.register=function(item)
{
    console.log(item.password2);
    console.log(item.username);
    if(item.password!=item.password2)
    {
        $scope.match="Password does not match"
    }
    else
    {
        $http.get('/showprofile/'+item.username).then(function(response) {
            console.log("I got the data I requested");
            $scope.users = response.data;
            console.log($scope.users.length);
            if($scope.users.length==0)
            {
                $http.post('/register', item).then(function(response) {
                    console.log(response.data);
                    $scope.result = response.data;
                    console.log($scope.result.message);
                  if($scope.result.message=="Registered")
                  {
                  document.getElementById("register_form").reset();    
                  $scope.match="Successfully Registered"
                  alert("Successfully Registered");      
                  }
                  else
                  {
                  alert($scope.result.message);  
                  }
              
                  })    
            }
            else
            {
                $scope.match="Username Already Exists"
            }
        })
            
    }
    
}




}]);
//**********************************STAR CONTROLLER****************************************************   
myApp.controller('starCtrl', ['$scope','$window','$routeParams', '$http', function($scope,$window,$routeParams,$http) {
    console.log("Hello World from controller");
     $scope.id = $routeParams.story_id;
    console.log("id"+$scope.id);
$http.get('/checksession').then(function(response) {
    console.log("I got the data I requested");
    $scope.status = response.data;
    console.log($scope.status.loginstatus);
    console.log($scope.status.username);
    if($scope.status.loginstatus==1)
    {
    $scope.username=$scope.status.username;
    $scope.user_id=$scope.status.user_id;//
    console.log($scope.status)
    console.log("hey"+$scope.status.user_id)
    $scope.username123=$scope.status.username;
document.getElementById("output_rating").style.display="none";
$http.get('/checkrate/'+$scope.id).then(function(response) {
    console.log("I got the data I requested kreekek");
    $scope.checkrate = response.data;
    console.log("habaa"+$scope.checkrate.length);

    if($scope.checkrate!=null){


    if($scope.checkrate.length==1)
    {
       document.getElementById("input_rating").style.display="none"; 
       document.getElementById("output_rating").style.display="block";

      $scope.user_rate=$scope.checkrate[0].rating;
      console.log($scope.user_rate);    
    $scope.Stars1 = $scope.user_rate;
    $scope.maxStars1 = 5; 
    $scope.getStarArray1 = function() {
      var result1 = [];
      for (var i = 1; i <= $scope.maxStars1; i++)
        result1.push(i);
      return result1;
    };
    $scope.getClass1 = function(index1) {
      return 'glyphicon glyphicon-star' + ($scope.Stars1 >= index1 ? '' : '-empty');
    };
    }
    else
    {
        document.getElementById("input_rating").style.display="block";

    }
    }
  })

    }
    else
    {
    $scope.username="Guest";         
    $scope.username123="Guest";
        document.getElementById("output_rating").style.display="none";

    }

  })

}]);
