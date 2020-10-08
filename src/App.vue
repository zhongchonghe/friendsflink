<template>
  <div>
    <el-row>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="addDialog"
        >添加友情链接</el-button
      >
    </el-row>
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="id" label="编号"> </el-table-column>
      <el-table-column prop="webname" label="网站名称"> </el-table-column>
      <el-table-column prop="website" label="网站地址"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="warning"
            @click="editDialog(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            @click="deleteDialog(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加友链对话框 -->
    <el-dialog
      title="添加友链"
      :visible.sync="dialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addFormRef"
        label-width="55px"
      >
        <el-form-item label="名称" prop="webname">
          <el-input v-model="addForm.webname"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="website">
          <el-input v-model="addForm.website"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑友链对话框 -->

    <el-dialog title="编辑友链" :visible.sync="editDialogVisible" width="30%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="55px"
      >
        <el-form-item label="名称" prop="webname">
          <el-input v-model="editForm.webname"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="website">
          <el-input v-model="editForm.website"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      dialogVisible: false,
      editDialogVisible: false,
      addForm: {
        webname: "",
        website: "",
      },
      editForm: {},
      editFormRules: {
        webname: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        website: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },
      rules: {
        webname: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        website: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  
  methods: {
    async getList() {
      const { data: res } = await this.$axios.get("sys/firendslink");
      this.list = res;
    },
    addDialog() {
      this.dialogVisible = true;
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项! ");
        }
        const { data: res } = await this.$axios.post(
          "sys/savefl",
          this.addForm
        );
        if (res.status !== 200) {
          this.$message.error("添加友情链接失败! ");
        }
        this.$message.success("添加友情链接成功! ");
        this.dialogVisible = false;
        this.getList();
      });
    },
    async editDialog(id) {
      const { data: res } = await this.$axios.get(`sys/detailfl/?id=${id}`);
      if (res.responseData.status !== 201) {
        return this.$message.error("查询信息失败! ");
      }
      this.editForm = res.result[0];
      this.editDialogVisible = true;
    },
    edit() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.post(
          `sys/detailfl/?id=${this.editForm.id}`,
          this.editForm
        );
        if (res.status !== 201) {
          return this.$message.error("更新失败! ");
        }
        this.editDialogVisible = false;
        this.getList();
        this.$message.success("更新数据成功! ");
      });
    },
    async deleteDialog(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$axios.delete(`sys/removefl/?id=${id}`);
      if (res.status !== 201) {
        return this.$message.error("删除失败! ");
      }
      this.$message.success("删除数据成功! ");
      this.getList();
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.el-table {
  margin-top: 20px;
}
/deep/.el-table th > .cell {
  text-align: center;
}

/deep/.el-table .cell {
  text-align: center;
}
</style>