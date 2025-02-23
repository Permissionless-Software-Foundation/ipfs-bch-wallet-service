/*
  Mocks for the use cases.
*/
/* eslint-disable */

class UserUseCaseMock {
  async createUser(userObj) {
    return {}
  }

  async getAllUsers() {
    return true
  }

  async getUser(params) {
    return true
  }

  async updateUser(existingUser, newData) {
    return true
  }

  async deleteUser(user) {
    return true
  }

  async authUser(login, passwd) {
    return {
      generateToken: () => {}
    }
  }
}

class BCH {
  async getTransactions(rpcData) {
    return {
      success: true,
      status: 200
    }
  }

  async getTxData(rpcData) {
    return {
      success: true,
      status: 200
    }
  }
}

class UsageUseCaseMock {
  async cleanUsage() {
    return {}
  }

  async getRestSummary() {
    return true
  }

  async getTopIps(params) {
    return true
  }

  async getTopEndpoints(existingUser, newData) {
    return true
  }
}

class UseCasesMock {
  constuctor(localConfig = {}) {
    // this.user = new UserUseCaseMock(localConfig)
  }

  user = new UserUseCaseMock()
  bch = new BCH()
  usage = new UsageUseCaseMock()
}

export default UseCasesMock;
