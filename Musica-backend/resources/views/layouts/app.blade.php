<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Music App')</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d1b3d 100%);
            color: #fff;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        header {
            margin-bottom: 40px;
        }

        h1 {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 10px;
            background: linear-gradient(90deg, #fff 0%, #FF2D55 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #FF2D55;
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 16px;
        }

        .btn:hover {
            background: #e02649;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(255, 45, 85, 0.3);
        }

        .alert {
            padding: 16px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            background: rgba(76, 217, 100, 0.2);
            border: 1px solid #4CD964;
            color: #4CD964;
        }

        .card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #ccc;
        }

        input[type="text"],
        input[type="number"],
        input[type="file"] {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #fff;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        input[type="file"]:focus {
            outline: none;
            border-color: #FF2D55;
            background: rgba(255, 255, 255, 0.15);
        }

        input[type="file"]::file-selector-button {
            padding: 8px 16px;
            background: rgba(255, 45, 85, 0.2);
            border: 1px solid #FF2D55;
            border-radius: 6px;
            color: #FF2D55;
            cursor: pointer;
            margin-right: 12px;
            font-weight: 600;
        }

        input[type="file"]::file-selector-button:hover {
            background: rgba(255, 45, 85, 0.3);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 16px;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        th {
            font-weight: 600;
            color: #FF2D55;
        }

        tr:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .song-cover {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            object-fit: cover;
        }

        .error {
            color: #FF453A;
            font-size: 14px;
            margin-top: 4px;
        }
    </style>
    @yield('styles')
</head>
<body>
    <div class="container">
        <header>
            <h1>@yield('header', 'Music App')</h1>
        </header>

        @yield('content')
    </div>
</body>
</html>
