@section("header")
    <div class="header">
        <div class="container">
            <h1>PeeSeaBee</h1>
            @if (Auth::check())
                <a href="{{ URL::route("user/logout") }}">
                    logout
                </a>
                |
                <a href="{{ URL::route("user/profile") }}">
                    profile
                </a>
            @else
<!--          <a style="padding-left: 20px" href="{{ URL::route("user/login") }}">
<!--                    Login -->
<!--          </a> -->
            @endif
        </div>
    </div>
@show