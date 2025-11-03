<script>
import ImageUploader from '@/views/murray-component/ImageUploader.vue'
import { getToken } from '@/utils/auth'
import {
  getGoodsList, add, edit, postageUpdate,
  skuUpdate, attrUpdate, detailIntroUpdate,
  categorizeUpdate
} from '@/api/goods/goods'
import Tinymce from '@/components/Tinymce'
import { getCategoryList } from '@/api/goods/category'
import log from 'echarts/src/scale/Log'

export default {
  components: { ImageUploader, Tinymce },
  data() {
    return {
      categorize: {
        normalIds: [],
        recommendIds: []
      },
      normalCats: [],
      recommendCats: [],
      detailIntro: {
        detailIntro: undefined
      },
      postage: {
        postage: 0,
        postFrom: null,
        postageIfFree: false,
        postageInRuleIfFree: false,
        postageSkuIfMerge: false
      },
      attrs: {
        attrs: [], //  Structure {name:'',vals:[],val: null,selectedValue: null}
        temName: ''
      },
      skus: {
        skus: [] // Structure {stock:0,cover:null, originPrice:0,price:0,skuId:null,skuName:null,skuSn:null,stock:0}
      },
      dialogImageUrl: undefined,
      dialogVisible: false,
      baseUrl: process.env.VUE_APP_API_HOST,
      active: '0',
      goods: {
        fileList: [],
        goodsId: undefined,
        name: undefined,
        cover: undefined,
        sliders: [],
        intro: undefined,
        params: {},
        ensure: undefined,
        coverUrl: undefined,
        paramsAttr: [{
          key: null,
          vals: null
        }]
      },
      rules: {
        name: { required: true, trigger: 'blur', message: '商品名不能为空/Goods Name cannot be empty' },
        cover: { required: true, trigger: 'blur', message: '封面不能为空/Cover cannot be empty' },
        intro: { required: true, trigger: 'blur', message: '商品介绍不能为空/Goods Intro cannot be empty' },
        postFrom: { required: true, trigger: 'blur', message: '发货地不能为空/Post from cannot be empty' }
      }
    }
  },
  computed: {
    addSkuComputed() {
      if (!this.attrs.attrs || this.attrs.attrs.length === 0) {
        return false
      }

      for (let i = 0; i < this.attrs.attrs.length; i++) {
        if (!this.attrs.attrs[i].selectedValue) {
          return false
        }
      }

      return true
    }
  },

  mounted() {
    this.goods.goodsId = parseInt(this.$route.query.id)
    // console.log(this.goods.goodsId);
    this.getCategoryList()
    if (this.$route.query.id) {
      getGoodsList(this.goods.goodsId).then(res => {
        this.goods.sliders = res.data.sliders
        this.goods.name = res.data.name
        this.goods.cover = res.data.cover
        this.goods.intro = res.data.intro
        this.goods.ensure = res.data.ensure
        this.goods.params = []
        Object.keys(res.data.params).forEach(key => {
          this.goods.paramsAttr.push({
            key: key,
            vals: res.data.params[key]
          })
        })
        this.goods.paramsAttr.push({ key: null, vals: null })
        this.goods.coverUrl = res.data.coverUrl
        res.data.slidersUrl.forEach(item => {
          this.goods.fileList.push({
            name: item,
            url: item
          })
        })
        // 邮寄信息
        this.postage.postage = res.data.postage
        this.postage.postFrom = res.data.postFrom
        this.postage.postageIfFree = res.data.postageIfFree
        this.postage.postageInRuleIfFree = res.data.postageInRuleIfFree
        this.postage.postageSkuIfMerge = res.data.postageSkuIfMerge

        this.attrs.attrs = res.data.attrs
        this.skus.skus = res.data.skus

        // this.detailIntro.detailIntro = res.data.detailIntro;
        this.$refs.tinymce.setContent(res.data.detailIntro)
        // res.data.catIds
        this.categorize.recommendIds =
          res.data.catIds.filter(e => this.recommendCats.some(e2 => e2.cateId === e))
        console.log(this.categorize.recommendIds)
        this.categorize.normalIds =
          res.data.catIds.filter(e => this.normalCats.some(e2 => e2.cateId === e))
        // console.log(this.categorize.normalIds)
      })
    }
  },
  methods: {
    headers() {
      return {
        Authorization: getToken()
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      // Delete this corresponding file from the server
      for (let i = 0; i < this.goods.sliders.length; i++) {
        if (file.response && file.response.data.path === this.goods.sliders[i] ||
          file.url && file.url.includes(this.goods.sliders[i])
        ) {
          this.goods.sliders.splice(i, 1)
        }

        // if ( ||this.goods.sliders[i] === file.response.data.path) {
        //   this.goods.sliders.splice(i, 1);
        // }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlePictureSuccess(res, file) {
      this.goods.sliders.push(res.data.path)
    },

    addParams() {
      this.goods.paramsAttr.push({ key: null, vals: null })
    },

    addSave() {
      this.$refs.goods.validate().then(() => {
        const params = {}
        this.goods.paramsAttr.forEach(item => {
          if (item.key && item.vals) {
            params[item.key] = item.vals
          }
        })
        this.goods.params = params
        if (this.goods.goodsId) {
          edit(this.goods).then(res => {
            this.$messageOk(res.message)
            this.toNext()
          })
        } else {
          add(this.goods).then(res => {
            this.$messageOk(res.message)
            this.goods.goodsId = res.data
            this.toNext()
          })
        }
      })
    },

    postageSave() {
      if (!this.goods.goodsId) {
        this.$messageErr('请先保存商品/Save goods first')
        return
      }
      this.$refs.postage.validate().then(res => {
        postageUpdate({
          ...this.postage,
          goodsId: this.goods.goodsId
        }).then(res => {
          this.$messageOk(res.message)
          this.toNext()
        })
      })
    },
    addAttrItem() {
      if (!this.attrs.temName || this.attrs.temName.trim().length === 0) {
        return
      }
      this.attrs.attrs.push({
        name: this.attrs.temName,
        vals: []
      })
      this.attrs.temName = undefined
    },
    toNext() {
      this.active = parseInt(this.active) + 1 + ''
    },
    addTag(attr, index) {
      if (!attr.val || attr.val.trim().length === 0) {
        return
      }
      attr.vals.push(attr.val)
      attr.val = null
    },
    delAllAttrs(index) {
      this.attrs.attrs.splice(index, 1)
    },
    addSku() {
      if (this.attrs.attrs.some(e => !e.selectedValue)) {
        this.$messageErr('请选择属性值/Please select attribute values')
        return
      }
      const attrInfo = {}
      this.attrs.attrs.forEach(e => {
        attrInfo[e.name] = e.selectedValue
      })
      this.skus.skus.push({
        attrInfo,
        stock: 0,
        cover: null,
        originPrice: 0,
        price: 0
      })

      this.attrs.attrs.forEach(e => {
        e.selectedValue = null
      })
    },
    saveAttrsAndSku() {
      if (!this.attrs.attrs || this.attrs.attrs.length === 0) {
        this.$messageErr('请添加属性/Please add attributes')
        return
      }

      for (let i = 0; i < this.attrs.attrs.length; i++) {
        if (!this.attrs.attrs[i].vals || this.attrs.attrs[i].vals.length === 0) {
          this.$messageErr('请添加属性可选值/Please add attribute values')
          return
        }
      }

      if (!this.skus.skus || this.skus.skus.length === 0) {
        this.$messageErr('请添加规格/Please add specifications')
        return
      }

      for (let i = 0; i < this.skus.skus.length; i++) {
        if (!this.skus.skus[i].price) {
          this.$messageErr('请填写规格的价格/Please fill in the price of the specification')
          return
        }

        if (!this.skus.skus[i].cover) {
          this.$messageErr('请上传规格的封面/Please upload the cover of the specification')
          return
        }
      }
      const goodsId = this.goods.goodsId
      attrUpdate({
        goodsId,
        attrs: this.attrs.attrs
      }).then(res => {
        skuUpdate({
          goodsId,
          skuList: this.skus.skus

        }).then(res => {
          this.$messageOk(res.message)
          this.toNext()
        })
      })
    },
    saveDetailIntro() {
      detailIntroUpdate({
        goodsId: this.goods.goodsId,
        detailIntro: this.detailIntro.detailIntro
      }).then(res => {
        this.$messageOk(res.message)
        this.toNext()
      })
    },
    saveCategory() {
      categorizeUpdate({
        goodsId: this.goods.goodsId,
        catIds: [
          ...this.categorize.normalIds,
          ...this.categorize.recommendIds
        ]

      }).then(res => {
        this.$messageOk(res.message)
        this.toNext()
      })
    },
    async getCategoryList() {
      await getCategoryList(null).then(res => {
        this.normalCats = res.data.list.filter(e => e.type === 1)
        this.recommendCats = res.data.list.filter(e => e.type === 2)
      })
    }

  }

}
</script>

<template>
  <div class="app-container">
    <el-card>
      <el-steps :active="parseInt(active)" finish-status="success">
        <el-step title="基础信息/Basic Info" />
        <el-step title="邮寄信息/Postage Info" />
        <el-step title="商品规格/Goods Specifications" />
        <el-step title="商品详情/Goods Detail" />
        <el-step title="商品分类/Goods Category" />
      </el-steps>

      <el-tabs v-model="active" tab-position="left" style="margin-top: 40px;">
        <el-tab-pane label="基础信息/Basic Info">
          <div style="width:60%;">
            <el-form
              ref="goods"
              :model="goods"
              :rules="rules"
              label-width="120px"
            >

              <el-form-item label="商品封面/Goods Cover" prop="cover">
                <image-uploader
                  :url="goods.coverUrl"
                  :path="goods.cover"
                  @ok="function(data)
                  {
                    goods.cover=data.path;
                    goods.coverUrl=data.url;
                  }"
                />
              </el-form-item>

              <el-form-item label="轮播图/Carousel" prop="sliders">
                <el-upload
                  :action="`${baseUrl}`+'/file/upload'"
                  :headers="headers()"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-success="handlePictureSuccess"
                  :file-list="goods.fileList"
                >
                  <i class="el-icon-plus" />
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>

              <el-form-item label="商品名称/Goods Name" prop="name">
                <el-input
                  v-model="goods.name"
                  placeholder="输入商品名称/Enter Goods Name"
                />
              </el-form-item>

              <el-form-item label="商品简介/Goods Intro" prop="intro">
                <el-input
                  v-model="goods.intro"
                  placeholder="输入商品简介/Enter Goods Intro"
                  type="textarea"
                />
              </el-form-item>

              <el-form-item label="商品售后/Goods Service" prop="ensure">
                <el-input
                  v-model="goods.ensure"
                  placeholder="输入商品售后/Enter Goods After Sale"
                  type="textarea"
                />
              </el-form-item>

              <el-form-item label="商品参数/Goods Params" prop="params">

                <el-form-item v-for="(param,index) in goods.paramsAttr" :key="index">
                  <el-row>
                    <el-col :span="12">
                      <el-input v-model="param.key" placeholder="输入参数名/Enter Params Name" type="text" />
                    </el-col>
                    <el-col :span="12">
                      <el-input
                        v-model="param.vals"
                        placeholder="输入参数值/Enter Params Value"
                        type="text"
                      />
                    </el-col>
                  </el-row>

                  <el-row style="align-items: flex-end;margin-top: 10px;">

                    <el-col :span="12">
                      <el-button
                        v-if="goods.paramsAttr.length>1"
                        style="display: inline-flex"
                        type="danger"
                        plain
                        @click.native.prevent="function(){
                          goods.paramsAttr.splice(index,1);
                        }"
                      >
                        删除参数/Del Params
                      </el-button>
                    </el-col>

                    <el-col :span="12">
                      <el-button
                        v-if="index===goods.paramsAttr.length-1"
                        style="display: inline-flex"
                        type="primary"
                        plain
                        @click.native.prevent="addParams"
                      >
                        添加参数/Add Params
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click.native.prevent="addSave"
                >
                  保存下一步/Next
                </el-button>
              </el-form-item>

            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="邮寄信息/Postage Info">
          <el-form
            ref="postage"
            :model="postage"
            :rules="rules"
            label-width="120px"
          >

            <div style="width:60%;">
              <el-form-item label="发货地/From" prop="postFrom">
                <el-input
                  v-model="postage.postFrom"
                  type="text"
                  placeholder="输入发货地/Enter the production place"
                />
              </el-form-item>

              <el-form-item label="单件运费/Postage" prop="postage">
                <el-input
                  v-model="postage.postage"
                  placeholder="输入单件运费/Enter the unit postage"
                  :disabled="postage.postageIfFree"
                />
              </el-form-item>

              <el-form-item label="是否包邮/Is shipment free" prop="postageIfFree">
                <el-checkbox v-model="postage.postageIfFree">包邮/Shipment Free</el-checkbox>
              </el-form-item>

              <el-form-item label="满额包邮/Full discount with free shipment" prop="postageInRuleIfFree">
                <el-checkbox
                  v-model="postage.postageInRuleIfFree"
                  :disabled="postage.postageIfFree"
                >包邮/Shipment Free
                </el-checkbox>
              </el-form-item>

              <el-form-item label="同规格合并/Merge identical specification posting" prop="postageInRuleIfFree">
                <el-checkbox
                  v-model="postage.postageSkuIfMerge"
                  :disabled="postage.postageIfFree"
                >包邮/Shipment Free
                </el-checkbox>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click.native.prevent="postageSave">保存下一步/Next</el-button>
              </el-form-item>

            </div>
          </el-form>

        </el-tab-pane>

        <el-tab-pane label="商品规格/Goods Specifications">
          <div style="width:100%;">
            <el-form
              ref="attrs"
              :model="attrs"
            >
              <el-form-item label="属性/Attrs">
                <el-row :gutter="10">
                  <el-col style="margin:12px 0;">
                    <el-input
                      v-model="attrs.temName"
                      placeholder="输入属性名称/Enter attribute name"
                      type="text"
                      @keyup.enter.native="addAttrItem"
                    />
                  </el-col>

                  <el-col>
                    <el-button
                      type="primary"
                      plain
                      size="small"
                      @click.native.prevent="addAttrItem"
                    >添加属性/Add Attributes
                    </el-button>
                  </el-col>

                </el-row>
              </el-form-item>

              <el-form-item
                v-for="(attr,index) in attrs.attrs"
                :label="attr.name"
              >
                <el-row>
                  <el-tag
                    v-for="(tag, indexTag) in attr.vals"
                    :key="tag"
                    style="margin: 0 5px;"
                    closable
                    :disable-transitions="false"
                    @close="function (){
                      attr.vals.splice(indexTag,1)
                    }"
                  >
                    {{ tag }}
                  </el-tag>

                  <el-input
                    v-model="attr.val"
                    placeholder="请输入规格/Enter specification"
                    class="input-new-tag"
                    size="small"
                    @keyup.enter.native="addTag(attr,index)"
                    @blur="addTag(attr,index);"
                  />

                  <el-button
                    type="danger"
                    plain
                    style="margin: 10px 0;"
                    @click.native.prevent="delAllAttrs(index)"
                  >
                    删除所有属性/Del All Attributes
                  </el-button>

                </el-row>

              </el-form-item>

              <el-divider content-position="left">编辑属性/Edit Attrs</el-divider>

              <el-form-item
                v-for="(attr,index) in attrs.attrs"
                :label="attr.name"
              >
                <el-radio-group v-model="attr.selectedValue" size="small">
                  <el-radio-button v-for="(val,index) in attr.vals" :label="val" />
                </el-radio-group>
              </el-form-item>

              <el-form-item>
                <el-tooltip
                  :disabled="!addSkuComputed"
                  class="item"
                  content="请选择所有属性/Select All Attributes"
                  placement="bottom"
                >
                  <el-button
                    :disabled="!addSkuComputed"
                    type="primary"
                    plain
                    style="margin: 10px 0;"
                    @click.native.prevent="addSku"
                  >
                    添加规格sku/Add Specifications Sku
                  </el-button>
                </el-tooltip>
              </el-form-item>

              <el-form-item>
                <el-table :data="skus.skus">
                  <el-table-column type="index" label="序号/Order No" />

                  <el-table-column v-slot="scope" label="封面/Cover">
                    <template>
                      <image-uploader
                        width="80px"
                        height="80px"
                        :url="scope.row.coverUrl"
                        :path="scope.row.cover"
                        @ok="function(data){
                          scope.row.cover=data.path;
                          scope.row.coverUrl=data.url;
                        }"
                      />
                    </template>
                  </el-table-column>

                  <el-table-column v-slot="scope" label="规格/Specification">
                    <template>
                      <el-tag v-for="(k,v) in scope.row.attrInfo">
                        {{ k }}
                      </el-tag>
                    </template>
                  </el-table-column>

                  <el-table-column v-slot="scope" label="原价/Original Price">
                    <el-input v-model="scope.row.originPrice" />
                  </el-table-column>

                  <el-table-column v-slot="scope" label="售价/Sale Price">
                    <el-input v-model="scope.row.price" />
                  </el-table-column>

                  <el-table-column v-slot="scope" label="库存/Stock">
                    <el-input v-model="scope.row.stock" type="number" />
                  </el-table-column>

                  <el-table-column v-slot="scope" label="操作/Operation">
                    <el-button plain size="small" @click.native.prevent="skus.skus.splice(scope.$index,1)">删除/Del
                    </el-button>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-divider content-position="left">编辑规格/Edit Specifications</el-divider>
              <el-form-item>
                <el-button type="primary" @click.native.prevent="saveAttrsAndSku">
                  保存下一步/Next
                </el-button>

              </el-form-item>

            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="商品详情/Goods Detail">
          <div style="width:60%;">
            <el-form :model="detailIntro">
              <div>
                <tinymce ref="tinymce" v-model="detailIntro.detailIntro" :height="300" />
              </div>

              <el-form-item>
                <el-button type="primary" @click.native.prevent="saveDetailIntro">
                  保存下一步/Next
                </el-button>
              </el-form-item>

            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品分类/Goods Category">

          <div>
            <el-form
              ref="categorize"
              :model="categorize"
              :rules="rules"
              label-width="120px"
            >

              <el-form-item label="普通分类/Common Category">
                <el-row>
                  <el-col :span="18">
                    <el-select v-model="categorize.normalIds" multiple>
                      <el-option
                        v-for="cate in normalCats"
                        :key="cate.cateId"
                        :value="cate.cateId"
                        :label="`${cate.name}/${cate.enName}`"
                      >
                        <template>
                          {{ cate.name }}/{{ cate.enName }}
                        </template>
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="推荐分类/Recommendation Category">
                <el-row>
                  <el-col :span="18">
                    <el-select v-model="categorize.recommendIds" multiple>
                      <el-option
                        v-for="cate in recommendCats"
                        :key="cate.cateId"
                        :value="cate.cateId"
                        :label="`${cate.name}/${cate.enName}`"
                      >
                        <template>
                          {{ cate.name }}/{{ cate.enName }}
                        </template>
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>

              <el-button
                type="primary"
                @click.native.prevent="saveCategory"
              >保存下一步/Next
              </el-button>

            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>

    </el-card>
  </div>
</template>

<style scoped lang="scss">

</style>
