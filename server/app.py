from flask import Flask, jsonify, request, session
import requests
from flask_cors import CORS
from flask_mysqldb import MySQL
import mysql.connector
from werkzeug.utils import secure_filename  # Import secure_filename function
import os
import jwt
import datetime
import bcrypt


app = Flask(__name__)
cors = CORS(app)

# Configure MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'shopping_site'
app.config['SECRET_KEY'] = 'sexyabhi'

mysql = MySQL(app)

# Define the upload folder
UPLOAD_FOLDER = 'C:/Users/dasab/OneDrive/Desktop/new/client/public'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def generate_token(id):
    payload = {
        'user_id': id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')


@app.route('/signup', methods=['POST'])
def signup():
    try:
        name = request.form['name']
        print(name)
        phone_number = request.form['phoneNumber']
        email = request.form['email']
        password = request.form['password']
        # Retrieve uploaded profile picture
        profile_pic = request.files['profilePic']
        hashed_password = bcrypt.hashpw(
            password.encode('utf-8'), bcrypt.gensalt())

        ext = ".jpg"
        print(ext)
        new_filename = name + ext
        profile_pic.save(os.path.join(
            app.config['UPLOAD_FOLDER'], new_filename))

        cur = mysql.connection.cursor()
        cur.execute(
            "SELECT * FROM user_information WHERE name=%s OR email=%s", (name, email))
        existing_user = cur.fetchone()
        if existing_user:
            cur.close()
            return jsonify({'message': 'Username or email already exists'}), 400

        else:
            cur.execute("INSERT INTO user_information (name, phone_no, email, password) VALUES (%s, %s, %s, %s)",
                        (name, phone_number, email, hashed_password))
            mysql.connection.commit()
            user_id = cur.lastrowid
            cur.close()

        return jsonify({'user_id': user_id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']

        # Check if the user exists in the database
        cur = mysql.connection.cursor()
        # print("1")
        cur.execute(
            "SELECT * FROM user_information WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()

        if user:
            # Check if the provided password matches the hashed password
            if bcrypt.checkpw(password.encode('utf-8'), user[4].encode('utf-8')):
                # Return user ID as JSON response
                return jsonify({'user_id': user[0]}), 200
            else:
                return jsonify({'error': 'Invalid email or password'}), 401
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/user', methods=['GET'])
def get_user():
    try:
        user_id = request.args.get('user_id')
        cur = mysql.connection.cursor()
        cur.execute(
            "SELECT * FROM user_information WHERE user_id = %s", [user_id])
        user = cur.fetchone()
        cur.close()

        if user:
            # Return user information
            user_data = {
                'id': user[0],
                'name': user[1],
                'phoneNumber': user[2],
                'email': user[3]
            }
            return jsonify(user_data), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/products')
def get_products():
    try:
        category = request.args.get('category')
        page = int(request.args.get('page'))
        limit = int(request.args.get('limit'))
        offset = (page - 1) * limit

        cur = mysql.connection.cursor()

        if category:
            if category.lower() == 'mobile':
                cur.execute("SELECT COUNT(*) FROM mobile")
                total_count = cur.fetchone()[0]

                cur.execute(
                    "SELECT * FROM mobile LIMIT %s OFFSET %s", (limit, offset))

            elif category.lower() == 'laptop':
                cur.execute("SELECT COUNT(*) FROM laptop")
                total_count = cur.fetchone()[0]
                cur.execute(
                    "SELECT * FROM laptop LIMIT %s OFFSET %s", (limit, offset))

            else:
                return jsonify({'error': 'Invalid category'}), 400
        else:
            cur.execute("SELECT * FROM products")

        products = cur.fetchall()
        cur.close()
        total_pages = (total_count + limit - 1) // limit

        product_list = []
        for product in products:
            product_dict = {
                'id': product[0],
                'name': product[1],
                'price': product[2],
                'brand': product[3],

            }
            product_list.append(product_dict)

        return jsonify(product_list, total_pages)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/add-to-cart', methods=['POST'])
def add_cart():

    try:
        data = request.get_json()
        user_Id = data.get('user_Id')
        product_category = data.get('product_category')
        product_name = data.get('product_name')
        product_price = data.get('product_price')
        product_brand = data.get('product_brand')
        quantity = data.get('quantity')

        cur = mysql.connection.cursor()

        cur.execute("SELECT * FROM cart WHERE user_Id = %s AND product_category = %s AND product_name = %s ",
                    (user_Id, product_category, product_name))

        existing_product = cur.fetchone()

        if existing_product:
           # If the same product is already in the cart, increase its quantity by 1
            new_quantity = existing_product[6] + 1
            cur.execute("UPDATE cart SET quantity = %s WHERE id = %s ",
                        (new_quantity, existing_product[0]))
        else:
            # If the product is not in the cart, insert it with quantity 1
            cur.execute("INSERT INTO cart (user_Id,product_category, product_name,product_price,product_brand,quantity) VALUES (%s,%s, %s, %s, %s, %s)",
                        (user_Id, product_category, product_name, product_price, product_brand, quantity))

        mysql.connection.commit()

        return jsonify({'message': 'Product added to cart successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/cart', methods=['GET'])
def get_cart():
    try:
        cur = mysql.connection.cursor()
        user_id = request.args.get('userId')

        cur.execute(f'SELECT * FROM cart WHERE user_Id = {user_id}')
        cart_items = cur.fetchall()
        cart_list = []
        for item in cart_items:
            item_dict = {
                'id': item[0],
                'category': item[2],
                'product_name': item[3],
                'product_price': item[4],
                'product_brand': item[5],
                'quantity': item[6]
            }
            cart_list.append(item_dict)
        cur.close()

        return jsonify(cart_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/cart', methods=['DELETE'])
def remove_item_from_cart():
    try:
        cur = mysql.connection.cursor()
        item_id = request.args.get('itemId')
        user_Id = request.json.get('userId')
        cur.execute(
            "DELETE FROM cart WHERE id = %s AND user_Id = %s", (item_id, user_Id))
        mysql.connection.commit()
        return jsonify({'message': 'Item removed from cart successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/cart/<int:item_id>', methods=['PUT'])
def update_cart_item_quantity(item_id):
    try:
        cur = mysql.connection.cursor()

        data = request.json
        new_quantity = data.get('quantity')
        user_Id = data.get('user_Id')

        if new_quantity is None:
            return jsonify({'error': 'Quantity not provided'}), 400

        cur.execute(
            f"UPDATE cart SET quantity = {new_quantity} WHERE id = {item_id} AND user_Id = {user_Id} ")
        mysql.connection.commit()

        return jsonify({'message': 'Quantity updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/emptycart', methods=['DELETE'])
def empty_cart():
    try:
        cur = mysql.connection.cursor()
        user_id = request.args.get('userId')

        cur.execute('DELETE FROM cart WHERE user_Id = %s', (user_id,))
        mysql.connection.commit()
        return jsonify({'message': 'Cart emptied successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/favorite', methods=['POST'])
def toggle_favorite():

    data = request.get_json()
    user_Id = data.get('user_Id')
    product_Id = data.get('product_Id')
    product_category = data.get('product_category')
    product_name = data.get('product_name')
    product_price = data.get('product_price')
    product_brand = data.get('product_brand')
    cur = mysql.connection.cursor()

    cur.execute("SELECT * FROM favorite WHERE user_Id = %s AND product_category = %s AND product_name = %s",
                (user_Id, product_category, product_name))
    favorite = cur.fetchone()

    if favorite:

        # If the product is already favorited, remove it from favorites
        cur.execute("DELETE FROM favorite WHERE user_id = %s AND product_category = %s AND product_name = %s",
                    (user_Id, product_category, product_name))

        mysql.connection.commit()
        is_favorite = False
    else:
        # If the product is not favorited, add it to favorites
        cur.execute("INSERT INTO favorite (user_Id,product_Id,product_category, product_name,product_price,product_brand) VALUES (%s, %s, %s, %s, %s,%s)",
                    (user_Id, product_Id, product_category, product_name, product_price, product_brand))

        mysql.connection.commit()
        is_favorite = True

    cur.close()
    return jsonify({'isFavorite': is_favorite})


@app.route('/favorites', methods=['GET'])
def get_favorites():

    user_id = request.args.get('userId')
    product_category = request.args.get('category')

    cur = mysql.connection.cursor()

    cur.execute("SELECT product_id FROM favorite WHERE user_id = %s AND product_category = %s ",
                (user_id, product_category))

    favorites = cur.fetchall()
    cur.close()

    # Convert the list of tuples to a list of product IDs
    favorite_products = [favorite[0] for favorite in favorites]

    return jsonify(favorite_products)


@app.route('/getFavorites', methods=['GET'])
def get_favorite_products():
    try:
        # Retrieve favorite products from the database
        cur = mysql.connection.cursor()
        user_Id = request.args.get('userId')

        cur.execute(f'SELECT * FROM favorite  WHERE user_id ={user_Id}')

        favorite_products = cur.fetchall()
        cur.close()

        # Convert favorite products to a list of dictionaries
        favorite_products_list = []
        for product in favorite_products:
            product_dict = {
                'id': product[0],
                'category': product[3],
                'product_name': product[4],
                'product_price': product[5],
                'product_brand': product[6]
            }
            favorite_products_list.append(product_dict)

        return jsonify(favorite_products_list)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/favorites', methods=['DELETE'])
def remove_favorite_product():
    try:
        product_id = request.args.get('itemId')
        cur = mysql.connection.cursor()
        user_id = request.json.get('userId')

        cur.execute(
            "DELETE FROM favorite WHERE id = %s AND user_Id = %s", (product_id, user_id))
        mysql.connection.commit()
        return jsonify({'message': 'Item removed from cart successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/product/price', methods=['GET'])
def get_product_price():
    product_name = request.args.get('name')
    print(product_name)
    if not product_name:
        return jsonify({'error': 'Product name is required'}), 400

    try:
        cur = mysql.connection.cursor()

        # Execute SQL query to fetch product price based on product name
        cur.execute("SELECT Price FROM mobile WHERE Name = %s UNION SELECT Price FROM laptop WHERE Name = %s",
                    (product_name, product_name))

        price_data = cur.fetchone()
        if price_data:
            price = price_data[0]
            return jsonify({'name': product_name, 'price': price})

        return jsonify({'error': 'Product not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/product/count', methods=['GET'])
def get_product_count():
    product_name = request.args.get('name')
    user_Id = request.args.get('userId')

    if not product_name:
        return jsonify({'error': 'Product name is required'}), 400

    try:
        cur = mysql.connection.cursor()

        # Execute SQL query to fetch product price based on product name
        cur.execute(
            "SELECT quantity FROM cart WHERE product_name = %s AND user_Id = %s", (product_name, user_Id))

        number_data = cur.fetchone()
        return jsonify(number_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/weather', methods=['GET'])
def get_weather():
    city = 'kolkata'
    api_key = 'dd2ef00bbccf1630b49b8ebc14f8f965'
    units = 'metric'  # You can change this to 'imperial' for Fahrenheit
    # Make a request to the OpenWeatherMap API
    response = requests.get(
        f'http://api.openweathermap.org/data/2.5/weather?q={city}&units={units}&appid={api_key}')

    if response.status_code == 200:
        weather_data = response.json()
        return jsonify(weather_data)
    else:
        return jsonify({'error': 'Error fetching weather data'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5004)
