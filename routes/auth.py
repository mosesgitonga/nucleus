from flask import Blueprint, request, jsonify
from controllers.users import Users
users = Users()

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')

@auth_bp.route('/user', methods=['POST'], strict_slashes=False)
def add_user():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No data required"})

    response, status = users.create_user(data)

    return jsonify(response), status 
